/* eslint-disable camelcase */

const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

const {
  crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES,
  crypto_sign_seed_keypair,
  crypto_sign_keypair,
} = require('sodium-universal')

/**
 * Generate a public and secret key pair from an optional
 * seed buffer. This function calls crypto_sign_seed_keypair and
 * crypto_sign_keypair internally.
 * @public
 * @param {(Buffer)} [seed]
 * @return {Object}
 * @throws TypeError
 */
function keyPair(seed) {
  if (null === seed) {
    throw new TypeError('crypto.keyPair: Seed cannot be null.')
  } else if (null != seed) {
    if (false == isBuffer(seed)) {
      throw new TypeError('crypto.keyPair: Expecting seed to be a buffer.')
    } else if (0 == seed.length) {
      throw new TypeError('crypto.keyPair: Cannot use empty buffer as seed.')
    } else if (seed.length < crypto_sign_SEEDBYTES) {
      throw new TypeError('crypto.keyPair: Seed buffer length too small. ' +
        `Expecting size ${crypto_sign_SEEDBYTES}.`)
    } else if (seed.length > crypto_sign_SEEDBYTES) {
      throw new TypeError('crypto.keyPair: Seed buffer length too large. ' +
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

module.exports = {
  keyPair
}
