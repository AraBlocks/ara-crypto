const isBuffer = require('is-buffer')

/* eslint-disable camelcase */
const {
  crypto_kdf_CONTEXTBYTES,
  crypto_kdf_BYTES_MAX,
  crypto_kdf_BYTES_MIN,
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
 * Derives a subkey using the master key and context.
 *
 * @public
 * @param {?(Buffer)} [subkey]
 * @param {?(Number)} [subkeyId]
 * @param {Buffer} ctx
 * @param {Buffer} key
 * @return {Buffer}
 * @throws TypeError
 */
function derive(subkey, subkeyId, ctx, key) {
  if (subkey && false === isBuffer(subkey)) {
    throw new TypeError('kdf.derive: Expecting subkey to be a buffer.')
  }

  if (undefined === subkey) {
    subkey = Buffer.allocUnsafe(crypto_kdf_KEYBYTES)
  }

  if (crypto_kdf_BYTES_MIN > subkey.length || crypto_kdf_BYTES_MAX < subkey.length) {
    throw new TypeError(`kdf.derive: Invalid subkey length: ${subkey.length}`)
  }

  if (subkeyId && 'number' !== typeof subkeyId) {
    throw new TypeError('kdf.derive: Expecting subkeyId to be a number.')
  }

  if (undefined === subkeyId) {
    subkeyId = 0
  }

  if (subkeyId < 0 || subkeyId > (2 ** 64) - 1) {
    throw new TypeError('kdf.derive: Expecting subkeyId to be between 0 and (2^64)-1.')
  }

  if (ctx && false === isBuffer(ctx)) {
    throw new TypeError('kdf.derive: Expecting context to be a buffer.')
  }

  if (undefined === ctx) {
    throw new TypeError('kdf.derive: Expecting context to be defined.')
  }

  if (crypto_kdf_CONTEXTBYTES !== ctx.length) {
    throw new TypeError(`kdf.derive: Invalid context length: ${ctx.length}`)
  }

  if (key && false === isBuffer(key)) {
    throw new TypeError('kdf.derive: Expecting master key to be a buffer.')
  }

  if (undefined === key) {
    throw new TypeError('kdf.derive: Expecting master key to be defined.')
  }

  if (crypto_kdf_KEYBYTES !== key.length) {
    throw new TypeError(`kdf.derive: Invalid master key length: ${key.length}`)
  }

  // derive subkey
  crypto_kdf_derive_from_key(subkey, subkeyId, ctx, key)
  return subkey
}

module.exports = {
  derive,
  keygen,
}
