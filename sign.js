const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

/* eslint-disable camelcase */
const {
  crypto_sign_detached,
  crypto_sign_BYTES,
} = require('sodium-universal')

/**
 * Sign a message buffer with a secret key buffer. This function calls
 * `crypto_sign_detached` on a buffer of size `crypto_sign_BYTES`.
 *
 * @public
 * @param {Buffer} message
 * @param {Buffer} secretKey
 * @return {Buffer}
 * @throws TypeError
 */
function sign(message, secretKey) {
  if (!message || false === isBuffer(message)) {
    throw new TypeError('crypto.sign: Expecting message to be a buffer.')
  } else if (0 === message.length) {
    throw new TypeError('crypto.sign: Cannot sign an empty message.')
  }

  if (!secretKey || false === isBuffer(secretKey)) {
    throw new TypeError('crypto.sign: Expecting secretKey to be a buffer.')
  } else if (0 === secretKey.length) {
    throw new TypeError('crypto.sign: Cannot sign with an empty secretKey.')
  }

  const buffer = alloc(crypto_sign_BYTES)
  crypto_sign_detached(buffer, message, secretKey)
  return buffer
}

module.exports = {
  sign
}
