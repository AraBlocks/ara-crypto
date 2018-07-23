const isBuffer = require('is-buffer')

/* eslint-disable camelcase */
const {
  crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES,
  crypto_box_SEALBYTES,

  crypto_box_seal_open,
  crypto_box_seal,
} = require('sodium-universal')

// export open so we can access it like `crypto.seal.open`
seal.open = open

/**
 * Seals a message based on a curve25519 public key for a recipient
 * who has the corresponding secret key.
 *
 * @public
 * @param {Buffer} message
 * @param {Object} opts
 * @param {Object} opts.publicKey
 * @returns {Buffer}
 * @throws TypeError
 */
function seal(message, opts) {
  if (!message || false === isBuffer(message)) {
    throw new TypeError('seal: Expecting message to be a buffer.')
  }

  if (0 === message.length) {
    throw new TypeError('seal: Invalid message length.')
  }

  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('seal: Expecting object.')
  }

  if (!opts.publicKey || false === isBuffer(opts.publicKey)) {
    throw new TypeError('seal: Expecting public key to be a buffer.')
  }

  if (crypto_box_PUBLICKEYBYTES !== opts.publicKey.length) {
    throw new TypeError('seal: Invalid public key length.')
  }

  const sealed = Buffer.allocUnsafe(crypto_box_SEALBYTES + message.length)

  crypto_box_seal(sealed, message, opts.publicKey)

  return sealed
}

/**
 * Opens a sealed message based on a curve25519 public key for a recipient
 * who has the corresponding secret key.
 *
 * @public
 * @param {Buffer} sealed
 * @param {Object} opts
 * @param {Object} opts.publicKey
 * @param {Object} opts.secretKey
 * @returns {Buffer}
 * @throws TypeError
 */
function open(sealed, opts) {
  if (!sealed || false === isBuffer(sealed)) {
    throw new TypeError('open: Expecting sealed message to be a buffer.')
  }

  if (sealed.length <= crypto_box_SEALBYTES) {
    throw new TypeError('open: Invalid sealed message length.')
  }

  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('open: Expecting object.')
  }

  if (!opts.publicKey || false === isBuffer(opts.publicKey)) {
    throw new TypeError('open: Expecting public key to be a buffer.')
  }

  if (!opts.secretKey || false === isBuffer(opts.secretKey)) {
    throw new TypeError('open: Expecting secret key to be a buffer.')
  }

  if (crypto_box_PUBLICKEYBYTES !== opts.publicKey.length) {
    throw new TypeError('open: Invalid public key length.')
  }

  if (crypto_box_SECRETKEYBYTES !== opts.secretKey.length) {
    throw new TypeError('open: Invalid secret key length.')
  }

  const message = Buffer.allocUnsafe(sealed.length - crypto_box_SEALBYTES)

  crypto_box_seal_open(message, sealed, opts.publicKey, opts.secretKey)

  return message
}

module.exports = {
  seal,
  open,
}
