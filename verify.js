'use strict'

const isBuffer = require('is-buffer')

const {
  crypto_sign_verify_detached,
  crypto_sign_PUBLICKEYBYTES,
  crypto_sign_BYTES,
} = require('sodium-universal')

/**
 * Verify signature for a message signed with a given
 * public key. This function calls `crypto_sign_verify_detached`
 * internally.
 * @public
 * @param {Buffer} signature
 * @param {Buffer} message
 * @param {Buffer} publicKey
 * @return {Boolean}
 * @throws TypeError
 */
function verify(signature, message, publicKey) {
  if (false == isBuffer(signature)) {
    throw new TypeError("crypto.verify: Expecting signature to be a buffer.")
  } else if (0 == signature.length) {
    throw new TypeError("crypto.verify: Cannot verify message with an signature buffer.")
  } else if (signature.length < crypto_sign_BYTES) {
    throw new TypeError("crypto.verify: Signature buffer too small.")
  } else if (signature.length > crypto_sign_BYTES) {
    throw new TypeError("crypto.verify: Signature buffer too large.")
  }

  if (false == isBuffer(message)) {
    throw new TypeError("crypto.verify: Expecting message to be a buffer.")
  } else if (0 == message.length) {
    throw new TypeError("crypto.verify: Cannot verify an empty message buffer.")
  }

  if (false == isBuffer(publicKey)) {
    throw new TypeError("crypto.verify: Expecting publicKey to be a buffer.")
  } else if (0 == publicKey.length) {
    throw new TypeError("crypto.verify: Cannot verify message with an publicKey buffer.")
  } else if (publicKey.length < crypto_sign_PUBLICKEYBYTES) {
    throw new TypeError("crypto.verify: Public key buffer too small.")
  } else if (publicKey.length > crypto_sign_PUBLICKEYBYTES) {
    throw new TypeError("crypto.verify: Public key buffer too large.")
  }

  return crypto_sign_verify_detached(signature, message, publicKey)
}

module.exports = {
  verify
}
