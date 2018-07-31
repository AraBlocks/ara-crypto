const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

/* eslint-disable camelcase */
const {
  crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES,
  crypto_sign_BYTES,

  crypto_sign_verify_detached,
  crypto_sign_seed_keypair,
  crypto_sign_detached,
  crypto_sign_keypair,
} = require('sodium-universal')

/**
 * Generate a public and secret key pair from an optional
 * seed buffer. This function calls crypto_sign_seed_keypair and
 * crypto_sign_keypair internally.
 *
 * @public
 * @param {(Buffer)} [seed]
 * @return {Object}
 * @throws TypeError
 */
function keyPair(seed) {
  if (null === seed) {
    throw new TypeError('ed25519.keyPair: Seed cannot be null.')
  } else if (undefined !== seed) {
    if (false === isBuffer(seed)) {
      throw new TypeError('ed25519.keyPair: Expecting seed to be a buffer.')
    } else if (0 === seed.length) {
      throw new TypeError('ed25519.keyPair: Cannot use empty buffer as seed.')
    } else if (seed.length < crypto_sign_SEEDBYTES) {
      throw new TypeError('ed25519.keyPair: Seed buffer length too small. ' +
        `Expecting size ${crypto_sign_SEEDBYTES}.`)
    } else if (seed.length > crypto_sign_SEEDBYTES) {
      throw new TypeError('ed25519.keyPair: Seed buffer length too large. ' +
        `Expecting size ${crypto_sign_SEEDBYTES}.`)
    }
  }

  const publicKey = alloc(crypto_sign_PUBLICKEYBYTES)
  const secretKey = alloc(crypto_sign_SECRETKEYBYTES)

  if (seed) {
    crypto_sign_seed_keypair(publicKey, secretKey, seed)
  } else {
    crypto_sign_keypair(publicKey, secretKey)
  }

  return { publicKey, secretKey }
}

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
    throw new TypeError('ed25519.sign: Expecting message to be a buffer.')
  } else if (0 === message.length) {
    throw new TypeError('ed25519.sign: Cannot sign an empty message.')
  }

  if (!secretKey || false === isBuffer(secretKey)) {
    throw new TypeError('ed25519.sign: Expecting secretKey to be a buffer.')
  } else if (0 === secretKey.length) {
    throw new TypeError('ed25519.sign: Cannot sign with an empty secretKey.')
  }

  const buffer = alloc(crypto_sign_BYTES)
  crypto_sign_detached(buffer, message, secretKey)
  return buffer
}

/**
 * Verify signature for a message signed with a given
 * public key. This function calls `crypto_sign_verify_detached`
 * internally.
 *
 * @public
 * @param {Buffer} signature
 * @param {Buffer} message
 * @param {Buffer} publicKey
 * @return {Boolean}
 * @throws TypeError
 */
function verify(signature, message, publicKey) {
  if (false === isBuffer(signature)) {
    throw new TypeError('ed25519.verify: Expecting signature to be a buffer.')
  } else if (0 === signature.length) {
    /* eslint-disable-next-line function-paren-newline */
    throw new TypeError(
      'ed25519.verify: Cannot verify message with an signature buffer.')
  } else if (signature.length < crypto_sign_BYTES) {
    throw new TypeError('ed25519.verify: Signature buffer too small.')
  } else if (signature.length > crypto_sign_BYTES) {
    throw new TypeError('ed25519.verify: Signature buffer too large.')
  }

  if (false === isBuffer(message)) {
    throw new TypeError('ed25519.verify: Expecting message to be a buffer.')
  } else if (0 === message.length) {
    throw new TypeError('ed25519.verify: Cannot verify an empty message buffer.')
  }

  if (false === isBuffer(publicKey)) {
    throw new TypeError('ed25519.verify: Expecting publicKey to be a buffer.')
  } else if (0 === publicKey.length) {
    /* eslint-disable-next-line function-paren-newline */
    throw new TypeError(
      'ed25519.verify: Cannot verify message with an publicKey buffer.')
  } else if (publicKey.length < crypto_sign_PUBLICKEYBYTES) {
    throw new TypeError('ed25519.verify: Public key buffer too small.')
  } else if (publicKey.length > crypto_sign_PUBLICKEYBYTES) {
    throw new TypeError('ed25519.verify: Public key buffer too large.')
  }

  return crypto_sign_verify_detached(signature, message, publicKey)
}

module.exports = {
  keyPair,
  verify,
  sign,
}
