/* eslint-disable no-inline-comments */
const { ShareData } = require('./share')
const { Secret } = require('./secret')
const { Table } = require('./table')
const { Codec } = require('./codec')
const isBuffer = require('is-buffer')

/**
 * Shamir Secret Sharing state context.
 * @public
 * @class Context
 */
class Context {
  static defaults() {
  }

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

module.exports = {
  Context
}
