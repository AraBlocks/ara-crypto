/* eslint-disable no-inline-comments */
const { randomBytes } = require('../random-bytes')
const { SharePoint } = require('./share')
const { blake2b } = require('../blake2b')
const isBuffer = require('is-buffer')

const kZeroes = new Array(1024).join('0')

/**
 * A class for encoding various values used in the secret
 * sharing context.
 * @public
 * @class Codec
 */
class Codec {
  /**
   * Codec class constructor.
   * @public
   * @constructor
   * @param {Context} ctx
   */
  constructor(ctx) {
    this.ctx = ctx
  }

  /**
   * Generate a fixed size random number as a BLAKE2b hash
   * based on context entropy and a fixed size PRNG.
   * @public
   * @param {Number} size
   * @return {Buffer}
   * @throws TypeError
   * @throws RangeError
   */
  random(size) {
    const seed = Buffer.concat([
      this.ctx.entropy,
      randomBytes(Math.max(size, 8))
    ])
    const value = Buffer.alloc(size)
    value.fill(blake2b(seed))
    return value
  }

  /**
   * Pad left side of a string with '0' until length is
   * a given multiple of bits defaulting to context bits.
   * @public
   * @param {String} string
   * @param {?(Number)} [multiple this.ctx.bits]
   * @returns String
   */
  pad(string, multiple) {
    const { bits } = this.ctx
    let missing = 0
    let result = string

    if (!multiple) {
      // eslint-disable-next-line no-param-reassign
      multiple = bits
    }

    if (string) {
      missing = string.length % multiple
    }

    if (missing) {
      const { length } = string
      result = (kZeroes + string).slice(-((multiple - missing) + length))
    }

    return result
  }

  /**
   * Split a string into parts by the bits set for
   * the context with an optional padding.
   * @public
   * @param {String} string
   * @param {Number} padding
   * @param {Number} radix
   * @return {Array<Number>}
   */
  split(string, padding, radix) {
    const parts = []
    const { bits } = this.ctx
    let i = 0

    if (padding) {
      // eslint-disable-next-line no-param-reassign
      string = this.pad(string, padding)
    }

    for (i = string.length; i > bits; i -= bits) {
      parts.push(parseInt(string.slice(i - bits, i), radix))
    }

    parts.push(parseInt(string.slice(0, i), radix))

    return parts
  }

  /**
   * Evaluation of `x' using Horner's method
   * @see {@link https://en.wikipedia.org/wiki/Horner%27s_method}
   * @public
   * @param {Number} x
   * @param {Array<Number>} coef
   * @return {Number}
   */
  horner(x, coef) {
    const { logs, exps } = this.ctx.table
    const { maxShares } = this.ctx
    const n = maxShares
    let b = 0

    for (let i = coef.length - 1; i >= 0; --i) {
      if (0 === b) {
        b = coef[i]
      } else {
        // eslint-disable-next-line no-bitwise
        b = exps[(logs[x] + logs[b]) % n] ^ coef[i]
      }
    }
    return b
  }

  /**
   * Computes the Lagrange interpolation polynomial f(x)
   * using a set of x and x points.
   * @public
   * @param {Number} x
   * @param {Object} points
   * @param {Number} points.x
   * @param {Number} points.y
   * @return {Number}
   */
  lagrange(x, points) {
    const { logs, exps } = this.ctx.table
    const { maxShares } = this.ctx
    let sum = 0
    for (let i = 0; i < points.x.length; ++i) {
      if (points.y[i]) {
        let product = logs[points.y[i]]

        for (let j = 0; j < points.x.length; ++j) {
          if (i !== j) {
            if (x === points.x[j]) {
              product = -1
              break
            }

            // eslint-disable-next-line no-bitwise
            const z = (logs[x ^ points.x[j]] - logs[points.x[i] ^ points.x[j]])
            product = (product + z + maxShares) % maxShares
          }
        }

        // eslint-disable-next-line no-bitwise
        sum = -1 === product ? sum : sum ^ exps[product]
      }
    }

    return sum
  }

  /**
   * @public
   * @param {Number} secret0
   * @param {Object} opts
   * @param {Number} opts.threshold
   * @param {Number} opts.shares
   * @return {Array<Object>}
   * @throws TypeError
   */
  partition(secret0, opts) {
    const { bits } = this.ctx
    // eslint-disable-next-line no-shadow
    const shares = []

    if (!opts || 'object' !== typeof opts) {
      throw new TypeError('Codec: Expecting object.')
    }

    if (!opts.threshold || 'number' !== typeof opts.threshold) {
      throw new TypeError('Codec: Expecting threshold to be a number.')
    }

    if (!opts.shares || 'number' !== typeof opts.shares) {
      throw new TypeError('Codec: Expecting shares to be a number.')
    }

    if ('number' !== typeof secret0) {
      throw new TypeError('Codec: Expecting secret0 to be a number.')
    }

    const coef = [ secret0 ] // f(0) = secret

    for (let i = 1; i < opts.threshold; ++i) {
      // convert a random value buffer of size in bits (b/8) from a hex string
      // to a parsed integer of base 16
      coef[i] = parseInt(this.random(bits / 8).toString('hex'), 16)
    }

    for (let i = 1; i < 1 + opts.shares; ++i) {
      const x = i
      const y = this.horner(x, coef)
      shares[i - 1] = new SharePoint(this.ctx, { x, y })
    }

    return shares
  }

  /**
   * @public
   * @param {String|Number} id
   * @param {String|Buffer} data
   * @return {String}
   * @throws TypeError
   */
  encode(id, data) {
    const { bits, radix, size } = this.ctx

    // eslint-disable-next-line no-param-reassign
    id = parseInt(id, radix)

    const maxLength = (size - 1).toString(radix).length

    // bits(36) + id(16)
    const header = Buffer.concat([
      Buffer.from(bits.toString(36).toUpperCase()),
      Buffer.from(this.pad(id.toString(radix), maxLength))
    ])

    if (false === isBuffer(data)) {
      // eslint-disable-next-line no-param-reassign
      data = Buffer.from(data)
    }

    return header.toString() + data.toString()
  }

  /**
   * @public
   */
  decode(buffer, encoding) {
    const { bytesPerChar } = this.ctx
    const padding = 2 * bytesPerChar
    const offset = padding
    const result = []

    if (isBuffer(buffer)) {
    // eslint-disable-next-line no-param-reassign
      buffer = buffer.toString(encoding)
    }

    // eslint-disable-next-line no-param-reassign
    buffer = this.pad(buffer, padding)

    for (let i = 0; i < buffer.length; i += offset) {
      result.unshift(decode(buffer.slice(i, i + offset), 'hex'))
    }

    return result.join('')

    function decode(chunk) {
      return String.fromCharCode(parseInt(chunk, 16))
    }
  }

  /**
   * Converts a string or buffer to a hex string padded based
   * on the context `bytesPerChar'.
   * @public
   * @param {String|Buffer} buffer
   * @param {?(String)} [encoding = utf8]
   * @return {String}
   */
  hex(buffer, encoding) {
    const { bytesPerChar } = this.ctx
    const padding = 2 * bytesPerChar
    const codec = this

    // eslint-disable-next-line no-param-reassign
    if (!encoding) { encoding = 'utf8' }

    if ('string' === typeof buffer) {
      return fromString()
    }

    if (isBuffer(buffer)) {
      return fromBuffer()
    }

    throw new TypeError('Codec: Unsupported input type.')

    function fromBuffer() {
      const chunks = []

      for (let i = 0; i < buffer.length; ++i) {
        chunks.unshift(codec.pad(buffer[i].toString(16), padding))
      }

      return chunks.join('')
    }

    function fromString() {
      if ('utf8' === encoding) {
        return fromUTF8String()
      } else if ('binary' === encoding) {
        return fromBinaryString()
      }

      throw new TypeError('Codec: Unsupported encoding type.')
    }

    function fromUTF8String() {
      const chunks = []

      for (let i = 0; i < buffer.length; ++i) {
        chunks.unshift(codec.pad(char(buffer[i]).toString(16), padding))
      }

      return chunks.join('')
    }

    function fromBinaryString() {
      const chunks = []
      // eslint-disable-next-line no-param-reassign
      buffer = codec.pad(buffer, 4)

      for (let i = buffer.length; i >= 4; i -= 4) {
        const chunk = parseInt(buffer.slice(i - 4, i), 2)
        chunks.unshift(chunk.toString(16))
      }

      return chunks.join('')
    }

    function char(c) {
      return c.charCodeAt(0)
    }
  }

  /**
   * @public
   * @param {Buffer} buffer
   * @return {String}
   */
  binary(buffer, radix) {
    const chunks = []
    // eslint-disable-next-line no-param-reassign
    if (!radix) { radix = 16 }
    for (let i = buffer.length - 1; i >= 0; --i) {
      let chunk = null
      if (isBuffer(buffer)) {
        chunk = buffer[i]
      } else if ('string' === typeof buffer) {
        chunk = parseInt(buffer[i], radix)
      } else if (Array.isArray(buffer)) {
        chunk = buffer[i]
        if ('string' === typeof chunk) {
          chunk = parseInt(chunk, radix)
        }
      } else {
        throw new TypeError('')
      }

      chunks.unshift(this.pad(chunk.toString(2), 4))
    }
    return chunks.join('')
  }
}

module.exports = {
  Codec
}
