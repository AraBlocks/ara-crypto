'use strict'

const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

const { kDefaultDiscoveryKeySize } = require('./constants')

const {
  crypto_generichash,
  crypto_generichash_KEYBYTES_MIN,
} = require('sodium-universal')


const defaultDiscoveryKeyMessageKey = alloc(
  crypto_generichash_KEYBYTES_MIN
).fill('ara')

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
  if (null == size || 'number' != typeof size) {
    size = kDefaultDiscoveryKeySize
  } else if (size <= 0) {
    throw new TypeError("crypto.discoveryKey: Expecting size to be greater than 0.")
  }

  if (null == key) {
    key = defaultDiscoveryKeyMessageKey
  } else if (false == isBuffer(key)) {
    throw new TypeError("crypto.discoveryKey: Expecting key to be a buffer")
  }

  if (false == isBuffer(buffer)) {
    throw new TypeError("crypto.discoveryKey: Expecting buffer.")
  }

  const digest = alloc(size)
  crypto_generichash(digest, buffer, key)
  return digest
}

module.exports = {
  discoveryKey
}
