const isBuffer = require('is-buffer')

/* eslint-disable camelcase */
const {
  crypto_shorthash_KEYBYTES,
  crypto_shorthash_BYTES,

  crypto_shorthash,
} = require('sodium-universal')

/**
 * Compute a 8 byte short hash for some message buffer based on
 * a given secret key.
 * @public
 * @param {Buffer} message
 * @param {Buffer} secretKey
 * @return {Buffer}
 * @throws TypeError
 * @throws RangeError
 */
function shash(message, secretKey) {
  if (false === isBuffer(message)) {
    throw new TypeError('shash: Expecting message to be buffer')
  }

  if (false === isBuffer(secretKey)) {
    throw new TypeError('shash: Expecting secret key to be buffer')
  }

  if (0 === message.length) {
    throw new RangeError('shash: Message buffer cannot be empty.')
  }

  if (crypto_shorthash_KEYBYTES !== secretKey.length) {
    const { length } = secretKey
    throw new RangeError(`shash: Invalid secret key length: ${length}`)
  }

  const hash = Buffer.allocUnsafe(crypto_shorthash_BYTES)

  crypto_shorthash(hash, message, secretKey)

  return hash
}

module.exports = {
  shash
}
