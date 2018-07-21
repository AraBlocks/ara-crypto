const { randomBytes } = require('./random-bytes')
const isBuffer = require('is-buffer')

/* eslint-disable camelcase */
const {
  crypto_kx_SESSIONKEYBYTES,
  crypto_kx_PUBLICKEYBYTES,
  crypto_kx_SECRETKEYBYTES,
  crypto_kx_SEEDBYTES,

  crypto_kx_client_session_keys,
  crypto_kx_server_session_keys,
  crypto_kx_seed_keypair,
} = require('sodium-universal')

/**
 * Generates a key exchange key pair.
 *
 * @public
 * @param {?(Buffer)} [seed]
 * @returns {Object}
 * @throws TypeError
 */
function keyPair(seed) {
  const publicKey = Buffer.allocUnsafe(crypto_kx_PUBLICKEYBYTES)
  const secretKey = Buffer.allocUnsafe(crypto_kx_SECRETKEYBYTES)

  if (seed && false === isBuffer(seed)) {
    throw new TypeError('kx.keyPair: Expecting seed to be a buffer.')
  }

  if (undefined === seed) {
    /* eslint-disable-next-line no-param-reassign */
    seed = randomBytes(crypto_kx_SEEDBYTES)
  }

  if (crypto_kx_SEEDBYTES !== seed.length) {
    throw new TypeError(`kx.keyPair: Invalid seed length: ${seed.length}`)
  }

  crypto_kx_seed_keypair(publicKey, secretKey, seed)
  return { publicKey, secretKey }
}

/**
 * Compute sender (tx) and receiver (rx) session keys for a client
 * based on a remote's public key.
 *
 * @public
 * @param {Object} opts
 * @param {Buffer} opts.publicKey
 * @param {Buffer} opts.secretKey
 * @param {Object} opts.remote
 * @param {Buffer} opts.remote.publicKey
 * @return {Object}
 * @throws TypeError
 */
function client(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('kx.client: Expecting object.')
  }

  if (!opts.publicKey || false === isBuffer(opts.publicKey)) {
    throw new TypeError('kx.client: Expecting buffer for public key.')
  }

  if (!opts.secretKey || false === isBuffer(opts.secretKey)) {
    throw new TypeError('kx.client: Expecting buffer for secret key.')
  }

  if (!opts.remote || 'object' !== typeof opts.remote) {
    throw new TypeError('kx.client: Expecting remote object.')
  }

  if (!opts.remote.publicKey || false === isBuffer(opts.remote.publicKey)) {
    throw new TypeError('kx.client: Expecting buffer for remote public key.')
  }

  if (crypto_kx_PUBLICKEYBYTES !== opts.publicKey.length) {
    const len = opts.publicKey.length
    throw new TypeError(`kx.client: Invalid public key length: ${len}`)
  }

  if (crypto_kx_SECRETKEYBYTES !== opts.secretKey.length) {
    const len = opts.secretKey.length
    throw new TypeError(`kx.client: Invalid secret key length: ${len}`)
  }

  if (crypto_kx_PUBLICKEYBYTES !== opts.remote.publicKey.length) {
    const len = opts.remote.publicKey.length
    throw new TypeError(`kx.client: Invalid remote public key length: ${len}`)
  }

  // reader/receiver
  const receiver = Buffer.allocUnsafe(crypto_kx_SESSIONKEYBYTES)

  // writer/sender
  const sender = Buffer.allocUnsafe(crypto_kx_SESSIONKEYBYTES)

  // compute rx and tx session keys
  crypto_kx_client_session_keys(
    receiver,
    sender,
    opts.publicKey,
    opts.secretKey,
    opts.remote.publicKey
  )

  return {
    receiver, sender,
    // short hand
    tx: sender, rx: receiver,
  }
}

/**
 * Compute sender (tx) and receiver (rx) session keys for a remote
 * based on a client's public key.
 *
 * @public
 * @param {Object} opts
 * @param {Buffer} opts.publicKey
 * @param {Buffer} opts.secretKey
 * @param {Object} opts.remote
 * @param {Buffer} opts.remote.publicKey
 * @return {Object}
 * @throws TypeError
 */
function remote(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('kx.client: Expecting object.')
  }

  if (!opts.publicKey || false === isBuffer(opts.publicKey)) {
    throw new TypeError('kx.client: Expecting buffer for public key.')
  }

  if (!opts.secretKey || false === isBuffer(opts.secretKey)) {
    throw new TypeError('kx.client: Expecting buffer for secret key.')
  }

  if (!opts.client || 'object' !== typeof opts.client) {
    throw new TypeError('kx.client: Expecting client object.')
  }

  if (!opts.client.publicKey || false === isBuffer(opts.client.publicKey)) {
    throw new TypeError('kx.client: Expecting buffer for client public key.')
  }

  if (crypto_kx_PUBLICKEYBYTES !== opts.publicKey.length) {
    const len = opts.publicKey.length
    throw new TypeError(`kx.remote: Invalid public key length: ${len}`)
  }

  if (crypto_kx_SECRETKEYBYTES !== opts.secretKey.length) {
    const len = opts.secretKey.length
    throw new TypeError(`kx.remote: Invalid secret key length: ${len}`)
  }

  if (crypto_kx_PUBLICKEYBYTES !== opts.client.publicKey.length) {
    const len = opts.client.publicKey.length
    throw new TypeError(`kx.remote: Invalid client  public key length: ${len}`)
  }

  // reader/receiver
  const receiver = Buffer.allocUnsafe(crypto_kx_SESSIONKEYBYTES)

  // writer/sender
  const sender = Buffer.allocUnsafe(crypto_kx_SESSIONKEYBYTES)

  // compute rx and tx session keys
  crypto_kx_server_session_keys(
    receiver,
    sender,
    opts.publicKey,
    opts.secretKey,
    opts.client.publicKey
  )

  return {
    receiver, sender,
    // short hand
    tx: sender, rx: receiver,
  }
}

module.exports = {
  keyPair,
  client,
  remote,
}
