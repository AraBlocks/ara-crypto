const isBuffer = require('is-buffer')

/* eslint-disable camelcase */
const {
  crypto_kdf_CONTEXTBYTES,
  crypto_kdf_KEYBYTES,

  crypto_kdf_derive_from_key,
  crypto_kdf_keygen,
} = require('./sodium')

/**
 * Generates a master key.
 *
 * @public
 * @param {?(Buffer)} [key]
 * @returns {Buffer}
 * @throws TypeError
 */
function keygen(key) {
  if (key && false === isBuffer(key)) {
    throw new TypeError('kdf.keygen: Expecting key to be a buffer.')
  }

  if (undefined === key) {
    key = Buffer.allocUnsafe(crypto_kdf_KEYBYTES)
  }

  if (crypto_kdf_KEYBYTES !== key.length) {
    throw new TypeError(`kdf.keygen: Invalid key length: ${key.length}`)
  }

  crypto_kdf_keygen(key)
  return key
}

/**
 * Initializes key derivation.
 *
 * @public
 * @param {Buffer} key
 * @param {?(Buffer)} [buffer]
 * @return {Object}
 * @throws TypeError
 */
function init(key, buffer) {
  if (key && false === isBuffer(key)) {
    throw new TypeError('kdf.init: Expecting key to be a buffer.')
  }

  if (undefined === key) {
    throw new TypeError('kdf.init: Expecting key to be defined.')
  }

  if (buffer) {
    if (false === isBuffer(buffer)) {
      throw new TypeError('kdf.init: Expecting context to be a buffer.')
    }

    if (crypto_kdf_CONTEXTBYTES !== buffer.length) {
      throw new TypeError(`kdf.init: Invalid context length: ${buffer.length}`)
    }
  }

  return {
    buffer: buffer || Buffer.alloc(crypto_kdf_CONTEXTBYTES),
    subkey: null,
    key
  }
}

/**
 * Updates the subkey in the context object.
 *
 * @public
 * @param {Object} ctx
 * @param {Number} id
 * @return {Buffer}
 * @throws TypeError
 */
function update(ctx, id) {
  if ('object' !== typeof ctx) {
    throw new TypeError('kdf.update: Expecting ctx to be an object.')
  }

  if (ctx.subkey && !isBuffer(ctx.subkey)) {
    throw new TypeError('kdf.update: Expecting ctx.subkey to be a buffer.')
  }

  if (!isBuffer(ctx.buffer)) {
    throw new TypeError('kdf.update: Expecting ctx.buffer to be a buffer.')
  }

  if (crypto_kdf_CONTEXTBYTES !== ctx.buffer.length) {
    throw new TypeError(`kdf.update: Invalid buffer length: ${ctx.buffer.length}.`)
  }

  if (!isBuffer(ctx.key)) {
    throw new TypeError('kdf.update: Expecting ctx.key to be a buffer.')
  }

  if ('number' !== typeof id) {
    throw new TypeError('kdf.update: Expecting id to be a number.')
  }

  if (id < 0 || id > (2 ** 64) - 1) {
    throw new TypeError('kdf.update: Expecting id to be between 0 and (2^64)-1.')
  }

  ctx.subkey = ctx.subkey || Buffer.allocUnsafe(crypto_kdf_KEYBYTES)
  crypto_kdf_derive_from_key(ctx.subkey, id, ctx.buffer, ctx.key)

  return ctx.subkey
}

/**
 * Final step to null the original context subkey.
 *
 * @public
 * @param {Object} ctx
 * @return {Buffer}
 * @throws TypeError
 */
function final(ctx) {
  if ('object' !== typeof ctx) {
    throw new TypeError('kdf.final: Expecting ctx to be an object.')
  }

  const { subkey } = ctx
  ctx.subkey = null

  return subkey
}

/**
 * Derives a subkey using the master key and context.
 *
 * @public
 * @param {Buffer} key
 * @param {Number} iterations
 * @param {?(Buffer)} [buffer]
 * @return {Buffer}
 * @throws TypeError
 */
function derive(key, iterations, buffer) {
  const ctx = init(key, buffer)

  if (iterations && 'number' !== typeof iterations) {
    throw new TypeError('kdf.derive: Expecting subkeyId to be a number.')
  }

  if (iterations < 1 || iterations > (2 ** 64) - 1) {
    throw new TypeError('kdf.derive: Expecting iterations to be between 1 and (2^64)-1.')
  }

  if (undefined === iterations) {
    throw new TypeError('kdf.derive: Expecting iterations to be defined.')
  }

  for (let i = 0; i < iterations; ++i) {
    update(ctx, i + 1)
  }

  return final(ctx)
}

module.exports = {
  derive,
  keygen,
  update,
  final,
  init,
}
