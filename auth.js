const isBuffer = require('is-buffer')

/* eslint-disable camelcase */
const {
  crypto_auth_KEYBYTES = 32,
  crypto_auth_BYTES = 32,

  crypto_auth_verify,
  crypto_auth,
} = require('./sodium')

// export verify so we can access it like `crypto.auth.verify`
auth.verify = verify

/**
 * Generates and returns a message authentication code (MAC) for
 * a given message and secret key.
 *
 * @public
 * @param {Buffer} message
 * @param {Buffer} key
 * @return {Buffer}
 * @throws TypeError
 */
function auth(message, key) {
  if (!message || false === isBuffer(message)) {
    throw new TypeError('auth: Expecting message to be a buffer.')
  }

  if (!key || false === isBuffer(key)) {
    throw new TypeError('auth: Expecting key to be a buffer.')
  }

  if (crypto_auth_KEYBYTES !== key.length) {
    throw new TypeError(`auth: Invalid key length: ${key.length}`)
  }

  const out = Buffer.allocUnsafe(crypto_auth_BYTES)
  crypto_auth(out, message, key)
  return out
}

/**
 * Verifies the authenticity of a message with a given message
 * authentication code (MAC) and secret key.
 *
 * @public
 * @param {Buffer} mac
 * @param {Buffer} message
 * @param {Buffer} key
 * @return {Boolean}
 * @throws TypeError
 */
function verify(mac, message, key) {
  if (!mac || false === isBuffer(mac)) {
    throw new TypeError('verify: Expecting MAC to be a buffer.')
  }

  if (crypto_auth_BYTES !== mac.length) {
    throw new TypeError(`auth: Invalid MAC length: ${mac.length}`)
  }

  if (!message || false === isBuffer(message)) {
    throw new TypeError('verify: Expecting message to be a buffer.')
  }

  if (!key || false === isBuffer(key)) {
    throw new TypeError('verify: Expecting key to be a buffer.')
  }

  if (crypto_auth_KEYBYTES !== key.length) {
    throw new TypeError(`verify: Invalid key length: ${key.length}`)
  }

  return Boolean(crypto_auth_verify(mac, message, key))
}

module.exports = {
  verify,
  auth,
}
