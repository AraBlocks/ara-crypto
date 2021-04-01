/* eslint-disable no-inline-comments */
const isZeroBuffer = require('is-zero-buffer')
const isBuffer = require('is-buffer')
const { randomBytes } = require('../random-bytes')
const { isSecret } = require('./secret')
const { Context } = require('./context')

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

  const ctx = new Context({ ...kContextDefaults, ...opts })
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
    false === isBuffer(secret)
    && false === isSecret(secret)
    && 'string' !== typeof secret
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

module.exports = {
  recover,
  secret,
  shares,
  init,
}
