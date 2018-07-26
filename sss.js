/* eslint-disable no-inline-comments */
const { randomBytes } = require('./random-bytes')
const isZeroBuffer = require('is-zero-buffer')
const { blake2b } = require('./blake2b')
const isBuffer = require('is-buffer')

const kContextDefaults = {
  bits: 8,
  prng: randomBytes,
  radix: 16,
  minBits: 3,
  maxBits: 20,
  padding: 128,
  bytesPerChar: 2,
  maxBytesPerChar: 6,
  get entropy() {
    return randomBytes(32)
  }
}

const kPrimitivePolynomials = [
  null, null, 1, 3, 3, 5, 3, 3,
  29, 17, 9, 5, 83, 27, 43, 3,
  45, 9, 39, 39, 9, 5, 3, 33,
  27, 9, 71, 39, 9, 5, 83,
]

const kZeroes = new Array(1024).join('0')

/**
 * Shamir Secret Sharing state context.
 * @public
 * @class Context
 */
class Context {
  /**
   * Context class constructor.
   * @public
   * @constructor
   * @param {Object} opts
   * @throws TypeError
   * @throws RangeError
   */
  constructor(opts) {
    if (!opts || 'object' !== typeof opts) {
      throw new TypeError('Context: Expecting object.')
    }

    if ('number' !== typeof opts.bits) {
      throw new TypeError('Context: Expecting bits to be a number.')
    }

    if ('number' !== typeof opts.radix) {
      throw new TypeError('Context: Expecting radix to be a number.')
    }

    if ('number' != typeof opts.minBits) {
      throw new TypeError('Context: Expecting minBits to be a number.')
    }

    if ('number' != typeof opts.maxBits) {
      throw new TypeError('Context: Expecting maxBits to be a number.')
    }

    if ('number' != typeof opts.padding) {
      throw new TypeError('Context: Expecting padding to be a number.')
    }

    if ('number' !== typeof opts.bytesPerChar) {
      throw new TypeError('Context: Expecting bytesPerChar to be a number.')
    }

    if ('number' !== typeof opts.maxBytesPerChar) {
      throw new TypeError('Context: Expecting maxBytesPerChar to be a number.')
    }

    if (0 !== opts.bits % 1) {
      throw new TypeError('Context: Expecting bits to be an integer.')
    }

    if (0 !== opts.minBits % 1) {
      throw new TypeError('Context: Expecting minBits to be an integer.')
    }

    if (0 !== opts.maxBits % 1) {
      throw new TypeError('Context: Expecting maxBits to be an integer.')
    }

    if (0 !== opts.padding % 1) {
      throw new TypeError('Context: Expecting padding to be an integer.')
    }

    if (undefined === kPrimitivePolynomials[opts.bits]) {
      throw new TypeError(`Context: bits (2^${opts.bits}) out of range.`)
    }

    if (false === isBuffer(opts.entropy)) {
      throw new TypeError('Context: Expecting entropy to be a buffer.')
    }

    if ('function' !== typeof opts.prng) {
      throw new TypeError('Context: Expecting PRNG to be a function.')
    }

    this.bits = opts.bits
    this.size = 2 ** this.bits // `1 << k' where `k = bits'
    this.prng = opts.prng
    this.radix = opts.radix
    this.minBits = opts.minBits
    this.maxBits = opts.maxBits
    this.padding = opts.padding
    this.entropy = opts.entropy
    this.maxShares = this.size - 1
    this.bytesPerChar = opts.bytesPerChar
    this.maxBytesPerChar = opts.maxBytesPerChar

    this.table = opts.table || new Table(this)
    this.codec = opts.codec || new Codec(this)
  }

  /**
   * Creates and returns a secret value from a string
   * or buffer.
   * @public
   * @param {String|Value} value
   * @param {?(String)} encoding
   * @return {Secret}
   */
  secret(value, encoding) {
    return new Secret(this, value, encoding)
  }

  /**
   * Partitions a secret into a given number of shares
   * requiring some number threshold of shares to reconstruct
   * the secret.
   * @public
   * @param {Secret|Buffer|String} secret
   * @param {Object} opts
   * @param {Number} opts.shares
   * @param {Number} opts.threshold
   * @param {?(Number)} opts.padding
   * @return {Array<String>}
   * @throws TypeError
   */
  // eslint-disable-next-line no-shadow
  shares(secret, opts) {
    if (!secret) {
      throw new TypeError('Context: Expecting secret to be a string or buffer.')
    }

    if (!opts || 'object' !== typeof opts) {
      throw new TypeError('Context: Expecting object.')
    }

    const { padding = this.padding } = opts
    // eslint-disable-next-line no-shadow
    const { shares, threshold } = opts
    const { maxShares, radix } = this

    if (!shares || 0 !== shares % 1 || shares > maxShares) {
      throw new TypeError('Context: Invalid shares count.')
    }

    if (!threshold || 0 !== threshold % 1 || threshold > maxShares) {
      throw new TypeError('Context: Invalid threshold count.')
    }

    if ('string' === typeof secret || isBuffer(secret)) {
      // eslint-disable-next-line no-param-reassign
      secret = this.secret(secret)
    }

    const bin = `1${this.codec.binary(secret.hex(), 16)}`
    const parts = this.codec.split(bin, padding, 2)
    const x = new Array(shares)
    const y = new Array(shares)

    for (let i = 0; i < parts.length; ++i) {
      const partitions = this.codec.partition(parts[i], { shares, threshold })
      for (let j = 0; j < shares; ++j) {
        if (!x[j]) {
          x[j] = partitions[j].x.toString(radix)
        }
        const a = partitions[j].y.toString(2)
        const b = y[j] || ''
        y[j] = this.codec.pad(a) + b
      }
    }

    for (let i = 0; i < shares; ++i) {
      x[i] = this.codec.encode(x[i], this.codec.hex(y[i], 'binary'))
      x[i] = Buffer.from(0 + x[i], 'hex') // prefix with '0' to fit buffer
    }

    return x
  }

  /**
   * Recovers a secret for a set of shares usings Lagrange
   * interpolation
   * @public
   * @param {Array<String>} shares
   * @param {Object} opts
   * @return {Secret}
   * @throws TypeError
   */
  // eslint-disable-next-line no-shadow
  recover(shares, opts) {
    const result = []
    const x = []
    const y = []

    if (undefined !== opts && 'object' !== typeof opts) {
      throw new TypeError('Context: Expecting object.')
    }

    for (let i = 0; i < shares.length; ++i) {
      const share = new ShareData(this, shares[i])
      if (false === x.includes(share.id)) {
        const bin = this.codec.binary(share.data, 16)
        x.push(share.id)
        const parts = this.codec.split(bin, 0, 2)
        for (let j = 0; j < parts.length; ++j) {
          if (!y[j]) { y[j] = [] }
          y[j][x.length - 1] = parts[j]
        }
      }
    }

    for (let i = 0; i < y.length; ++i) {
      const p = this.codec.lagrange(0, { x, y: y[i] })
      result.unshift(this.codec.pad(p.toString(2)))
    }

    const string = result.join('')
    const bin = string.slice(string.indexOf('1') + 1)
    const hex = this.codec.hex(bin, 'binary')
    const value = this.codec.decode(hex)
    // eslint-disable-next-line no-shadow
    const secret = new Secret(this, value)
    return secret
  }
}

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

/**
 * A table of logs and exps
 * @class Table
 */
class Table {
  /**
   * Table class constructor.
   * @public
   * @param {Context} ctx
   * @param {Number} ctx.size
   * @param {Number} ctx.maxShares
   */
  constructor(ctx) {
    if (!ctx || 'object' !== typeof ctx) {
      throw new TypeError('Table: Expecting context to be an object.')
    }

    const { size, maxShares } = ctx

    if ('number' !== typeof size) {
      throw new RangeError('Table: Expecting size to be a number.')
    }

    if (0 !== size % 1 || size <= 0) {
      throw new RangeError('Table: Expecting size to be a positive number.')
    }

    const primitive = kPrimitivePolynomials[ctx.bits]

    this.logs = new Array(size)
    this.exps = new Array(size)

    this.logs[0] = 0

    for (let i = 0, x = 1; i < size; ++i) {
      this.exps[i] = x
      this.logs[x] = i
      // eslint-disable-next-line no-bitwise
      x <<= 1
      if (size <= x) {
        // eslint-disable-next-line no-bitwise
        x ^= primitive
        // eslint-disable-next-line no-bitwise
        x &= maxShares
      }
    }
  }
}

/**
 * A class to wrap a secret value in a buffer.
 * @public
 * @class Secret
 */
class Secret {
  /**
   * Secret class constructor.
   * @public
   * @constructor
   * @param {Context} ctx
   * @param {String|Buffer} value
   * @param {?(String)} encoding
   * @throws TypeError
   */
  constructor(ctx, value, encoding) {
    if (!ctx || 'object' !== typeof ctx) {
      throw new TypeError('Secret: Expecting context to be an object.')
    }

    if (isBuffer(value)) {
      if (isZeroBuffer(value)) {
        throw new TypeError('Secret: Value buffer cannot be zero buffer.')
      } else if (0 === value.length) {
        throw new TypeError('Secret: Value buffer cannot be empty.')
      }
    }

    if ('string' === typeof value && 0 === value.trim().length) {
      throw new TypeError('Secret: Value buffer string be empty.')
    }

    this.ctx = ctx

    if (isBuffer(value)) {
      this.buffer = value
    } else if ('string' === typeof value) {
      this.buffer = Buffer.from(value.trim(), encoding)
    } else {
      throw new TypeError(`Secret: Invalid value type: ${typeof value}`)
    }
  }

  /**
   */
  get length() {
    return this.buffer.length
  }

  /**
   */
  valueOf() {
    return this.buffer
  }

  /**
   * Returns the string encoding of the secret value.
   * @public
   * @param {?(String)} [encoding]
   * @return {String}
   */
  toString(encoding) {
    return this.buffer.toString(encoding)
  }

  /**
   * Returns the hex string encoding of the secret value.
   * @public
   * @return {String}
   */
  hex() {
    return this.ctx.codec.hex(this.buffer)
  }

  /**
   * Returns the binary string encoding of the secret value.
   * @public
   * @return {String}
   */
  binary() {
    return this.ctx.codec.binary(this.buffer)
  }
}

/**
 * @public
 * @class SharePoint
 */
class SharePoint {
  /**
   * SharePoint class constructor.
   * @public
   * @constructor
   * @param {Context} ctx
   * @param {Object} opts
   */
  constructor(ctx, opts) {
    this.x = opts.x
    this.y = opts.y
  }
}

/**
 * A class for representing share data.
 * @public
 * @class ShareData
 */
class ShareData {
  /**
   * Parse input into a ShareData instance.
   * @public
   * @static
   * @param {String|Buffer|Object} input
   * @param {?(Object)} opts
   * @return {ShareData}
   */
  static parse(input, opts) {
    if (!opts) {
      // eslint-disable-next-line no-param-reassign
      opts = {}
    }

    if (!opts.radix) {
      // eslint-disable-next-line no-param-reassign
      opts.radix = 16
    }

    if (isBuffer(input)) {
      // only deal with string input
      // eslint-disable-next-line no-param-reassign
      input = input.toString('hex')
    }

    if ('string' === typeof input) {
      // remove leading 0
      if ('0' === input[0]) {
        // eslint-disable-next-line no-param-reassign
        input = input.slice(1)
      }

      const result = { id: null, bits: null, data: null }
      // bits are store in first byte as a base36 value
      result.bits = parseInt(input.slice(0, 1), 36)

      const maxBits = (2 ** result.bits) - 1
      const idLength = maxBits.toString(opts.radix).length
      const regex = `^([a-kA-K3-9]{1})([a-fA-F0-9]{${idLength}})([a-fA-F0-9]+)$`
      const matches = new RegExp(regex).exec(input)

      if (matches && matches.length) {
        result.id = parseInt(matches[2], opts.radix)
        // eslint-disable-next-line
        result.data = matches[3]
      }

      return result
    }

    if (input && 'object' === typeof input) {
      if (input.id && input.bits && input.data) {
        return input
      }
    }

    throw new TypeError('Unsupported input.')
  }

  /**
   * ShareData class constructor.
   * @public
   * @constructor
   * @param {Context} ctx
   * @param {String|Buffer|Object} share
   */
  constructor(ctx, share) {
    const parsed = ShareData.parse(share, ctx)
    this.id = parsed.id
    this.bits = parsed.bits
    this.data = parsed.data
  }
}

/**
 * Initializes and returns a context with defaults.
 * @public
 * @see {@link Content}
 * @param {?(Object)} opts
 * @return {Context}
 * @throws TypeError
 * @throws Error
 */
function init(opts) {
  if (undefined !== opts && 'object' !== typeof opts) {
    throw new TypeError('init: Expecting object.')
  }

  const ctx = new Context(Object.assign({}, kContextDefaults, opts))
  return ctx
}

/**
 * Create a secret value that can be split into shares.
 * @public
 * @param {String|Buffer} value
 * @param {?(Object)} opts
 * @return {Secret}
 * @throws TypeError
 * @throws Error
 */
// eslint-disable-next-line no-shadow
function secret(value, opts) {
  if (undefined === value) {
    throw new TypeError('secret: Value cannot be undefined.')
  }

  if (null === value) {
    throw new TypeError('secret: Value cannot be null.')
  }

  if ('string' !== typeof value && false === isBuffer(value)) {
    throw new TypeError('secret: Expecting value to be a string or buffer.')
  }

  if ('string' === typeof value && 0 === value.length) {
    throw new TypeError('secret: Value cannot be an empty string.')
  }

  if (isBuffer(value) && 0 === value.length) {
    throw new TypeError('secret: Value cannot be a empty buffer.')
  }

  if (isBuffer(value) && isZeroBuffer(value)) {
    throw new TypeError('secret: Value cannot be a zero buffer.')
  }

  if (null === opts) {
    throw new TypeError('secret: Options cannot tbe null.')
  }

  if (undefined !== opts && 'object' !== typeof opts) {
    throw new TypeError('secret: Expecting options to be an object.')
  }

  return init(opts).secret(value)
}

/**
 * Create shares from a secret.
 * @public
 * @param {Secret|String|Buffer} secret
 * @param {Object} opts
 * @param {Number} opts.shares
 * @param {Number} opts.threshold
 * @param {?(Number)} opts.padding
 * @return {Array<Buffer>}
 * @throws TypeError
 * @throws Error
 */
// eslint-disable-next-line no-shadow
function shares(secret, opts) {
  if (null === secret) {
    throw new TypeError('shares: Secret cannot be null.')
  }

  if (undefined === secret) {
    throw new TypeError('shares: Secret cannot be undefined.')
  }

  if (
    false === isBuffer(secret) &&
    false === isSecret(secret) &&
    'string' !== typeof secret
  ) {
    throw new TypeError('shares: Invalid secret type.')
  }

  if ('string' === typeof secret && 0 === secret.length) {
    throw new TypeError('shares: Secret cannot be an empty string.')
  }

  if (isBuffer(secret) && 0 === secret.length) {
    throw new TypeError('shares: Secret cannot be a empty buffer.')
  }

  if (isSecret(secret) && false === (secret.length > 0)) {
    throw new TypeError('shares: Secret cannot be empty.')
  }

  if (null === opts) {
    throw new TypeError('shares: Options cannot be null.')
  }

  if (undefined === opts || 'object' !== typeof opts) {
    throw new TypeError('shares: Expecting options to be an object.')
  }

  return init().shares(secret, opts)
}

/**
 * Recover a secret from a set of shares.
 * @public
 * @param {Array<Buffer|String>} shares
 * @param {Object} opts
 * @return {Secret}
 * @throws TypeError
 * @throws Error
 */
// eslint-disable-next-line no-shadow
function recover(shares, opts) {
  if (undefined !== opts && 'object' !== typeof opts) {
    throw new TypeError('recover: Expecting object.')
  }

  return init(opts).recover(shares, opts)
}

/**
 * Helper function to determine if a value is an instance of
 * Secret without using the 'instanceof' operator. This function
 * uses contrived heuristics, duck typing if you will, to determine
 * if a value is a 'Secret'.
 * @see {@link https://en.wikipedia.org/wiki/Duck_typing}
 * @public
 * @param {Mixed} value
 * @return {Boolena}
 */
function isSecret(value) {
  if (!value || 'object' !== typeof value) {
    return false
  }

  if (value instanceof Secret) {
    return true
  }

  const { prototype } = Secret
  const names = Object.getOwnPropertyNames(prototype)
  const truths = names.map(map)

  truths.push(isBuffer(value.buffer))
  truths.push('object' === typeof value.ctx)

  return truths.every(Boolean)

  // quacks, walks, and talks like a Secret (:
  function map(k) {
    return k in value
  }
}

module.exports = {
  SharePoint,
  ShareData,
  Context,
  Secret,
  Codec,
  Table,

  isSecret,
  recover,
  secret,
  shares,
  init,
}
