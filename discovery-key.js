const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

const { kDefaultDiscoveryKeySize } = require('./constants')

/* eslint-disable camelcase */
const {
  crypto_generichash,
  crypto_generichash_KEYBYTES_MIN,
} = require('sodium-universal')

/* eslint-disable camelcase */
const kDefaultDiscoveryKeyMessageKey = alloc(crypto_generichash_KEYBYTES_MIN)
kDefaultDiscoveryKeyMessageKey.fill('ara')

/**
 * Generate a discovery digest useful for network
 * keys. This function calls `crypto_generichash` internally.
 * @public
 * @param {Buffer|Array<Buffer>} buffer
 * @param {?(Number)} [size = 32]
 * @return {Buffer}
 * @throws TypeError
 */
function discoveryKey(buffer, size, key) {
  if (Number.isNaN(size) || 'number' !== typeof size) {
    /* eslint-disable no-param-reassign */
    size = kDefaultDiscoveryKeySize
  } else if (size <= 0) {
    throw new TypeError('crypto.discoveryKey: Expecting size to be greater than 0.')
  }

  if (!key) {
    /* eslint-disable no-param-reassign */
    key = kDefaultDiscoveryKeyMessageKey
  } else if (false === isBuffer(key)) {
    throw new TypeError('crypto.discoveryKey: Expecting key to be a buffer')
  }

  if (false === isBuffer(buffer)) {
    throw new TypeError('crypto.discoveryKey: Expecting buffer.')
  }

  const digest = alloc(size)
  crypto_generichash(digest, buffer, key)
  return digest
}

module.exports = {
  discoveryKey
}
