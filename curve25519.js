/* eslint-disable camelcase */
const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

/* eslint-disable camelcase */
const {
  crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES,
  crypto_scalarmult_BYTES,
  crypto_sign_SEEDBYTES,

  crypto_sign_ed25519_pk_to_curve25519,
  crypto_sign_ed25519_sk_to_curve25519,
  crypto_sign_seed_keypair,
  crypto_sign_keypair,
  crypto_scalarmult,
} = require('./sodium')

/**
 * Generate a Curve25519 public and secret key pair from an optional
 * seed buffer. This function calls crypto_sign_seed_keypair and
 * crypto_sign_keypair internally and converts to Curve25519 key pair
 * calling crypto_sign_ed25519_pk_to_curve25519 and
 * crypto_sign_ed25519_sk_to_curve25519.
 * @public
 * @param {(Buffer)} [seed]
 * @return {Object}
 * @throws TypeError
 */
function keyPair(seed) {
  if (null === seed) {
    throw new TypeError('curve25519.keyPair: Seed cannot be null.')
  } else if (undefined !== seed) {
    if (false === isBuffer(seed)) {
      throw new TypeError('curve25519.keyPair: Expecting seed to be a buffer.')
    } else if (0 === seed.length) {
      throw new TypeError('curve25519.keyPair: Seed buffer cannot be empty.')
    } else if (seed.length < crypto_sign_SEEDBYTES) {
      throw new TypeError('curve25519.keyPair: Seed buffer length too small. ' +
        `Expecting size ${crypto_sign_SEEDBYTES}.`)
    } else if (seed.length > crypto_sign_SEEDBYTES) {
      throw new TypeError('curve25519.keyPair: Seed buffer length too large. ' +
        `Expecting size ${crypto_sign_SEEDBYTES}.`)
    }
  }

  const publicKey = alloc(crypto_sign_PUBLICKEYBYTES)
  const secretKey = alloc(crypto_sign_SECRETKEYBYTES)

  const out = {
    publicKey: alloc(crypto_scalarmult_BYTES),
    secretKey: alloc(crypto_scalarmult_BYTES),
  }

  if (seed) {
    crypto_sign_seed_keypair(publicKey, secretKey, seed)
  } else {
    crypto_sign_keypair(publicKey, secretKey)
  }

  crypto_sign_ed25519_pk_to_curve25519(out.publicKey, publicKey)
  crypto_sign_ed25519_sk_to_curve25519(out.secretKey, secretKey)

  return out
}

/**
 * Compute a shared key from a 32 byte secret key and a 32 byte public
 * key. If keys are larger than 32 bytes, they will be truncated when read.
 * @public
 * @param {Buffer} secretKey
 * @param {Buffer} publicKey
 * @return {Buffer}
 * @throws TypeError
 * @throws RangeError
 */
function shared(secretKey, publicKey) {
  if (!secretKey || false === isBuffer(secretKey)) {
    throw new TypeError('shared: Expecting secret key to be a buffer.')
  }

  if (!publicKey || false === isBuffer(publicKey)) {
    throw new TypeError('shared: Expecting public key to be a buffer.')
  }

  if (secretKey.length < 32) {
    throw new RangeError('shared: Expecting secret key to be 32 bytes.')
  }

  if (publicKey.length < 32) {
    throw new RangeError('shared: Expecting public key to be 32 bytes.')
  }

  const key = Buffer.allocUnsafe(32)

  crypto_scalarmult(key, secretKey.slice(0, 32), publicKey.slice(0, 32))

  return key
}

module.exports = {
  keyPair,
  shared,
}
