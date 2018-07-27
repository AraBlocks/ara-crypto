/* eslint-disable no-inline-comments */
const isZeroBuffer = require('is-zero-buffer')
const isBuffer = require('is-buffer')

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

/**
 * A class to wrap a secret value in a buffer.
 * @public
 * @class Secret
 */
class Secret {
  /**
   * Alias to isSecret.
   * @see {@link isSecret}
   * @public
   * @static
   * @param {Mixed} value
   * @return {Boolena}
   */
  static isSecret(value) {
    return isSecret(value)
  }

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
   * Length of secret value
   * @public
   * @accessor
   * @type {Number}
   */
  get length() {
    return this.buffer ? this.buffer.length : 0
  }

  /**
   * Overloads the `valueOf' magic function to return
   * a buffer that points to the secret value.
   * @public
   * @return {Buffer}
   */
  valueOf() {
    return this.buffer || null
  }

  /**
   * Returns the string encoding of the secret value.
   * @public
   * @param {?(String)} [encoding]
   * @return {String}
   */
  toString(encoding) {
    return this.buffer ? this.buffer.toString(encoding) : null
  }

  /**
   * Returns the hex string encoding of the secret value.
   * @public
   * @return {String}
   */
  hex() {
    return this.buffer ? this.ctx.codec.hex(this.buffer) : null
  }

  /**
   * Returns the binary string encoding of the secret value.
   * @public
   * @return {String}
   */
  binary() {
    return this.buffer ? this.ctx.codec.binary(this.buffer) : null
  }
}

module.exports = {
  isSecret,
  Secret
}
