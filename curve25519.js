const alloc = require('buffer-alloc-unsafe')
const kp = require('./key-pair')

const {
  crypto_sign_ed25519_pk_to_curve25519,
  crypto_sign_ed25519_sk_to_curve25519,
  crypto_scalarmult_BYTES,
} = require('sodium-universal')

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
  const { publicKey, secretKey } = kp.keyPair(seed)
  const out = {
    publicKey: alloc(crypto_scalarmult_BYTES),
    secretKey: alloc(crypto_scalarmult_BYTES),
  }

  crypto_sign_ed25519_pk_to_curve25519(out.publicKey, publicKey)
  crypto_sign_ed25519_sk_to_curve25519(out.secretKey, secretKey)

  return out
}

module.exports = {
  keyPair
}
