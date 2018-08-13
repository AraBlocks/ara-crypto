/* eslint-disable camelcase */
const { crypto_generichash_batch } = require('./sodium')
const isBuffer = require('is-buffer')
const alloc = require('buffer-alloc-unsafe')

const kDefaultBlake2bSize = 32

/**
 * Generates a blake2b digest hash from input of a
 * given size defaulting to 32 bytes. This function calls
 * `crypto_generichash_batch` internally.
 * @public
 * @param {Buffer|Array<Buffer>} buffer
 * @param {?(Number)} [size = 32]
 * @return {Buffer}
 * @throws TypeError
 */
function blake2b(buffer, size) {
  /* eslint-disable no-param-reassign */
  if (null == size || 'number' !== typeof size) {
    size = kDefaultBlake2bSize
  } else if (size <= 0) {
    throw new TypeError('crypto.blake2b: Expecting size to be greater than 0.')
  }

  if (isBuffer(buffer)) {
    /* eslint-disable-line no-param-reassign */
    buffer = [ buffer ]
  }

  if (false === Array.isArray(buffer)) {
    throw new TypeError('crypto.blake2b: Expecting buffer as input.')
  }

  for (let i = 0; i < buffer.length; ++i) {
    if (false === isBuffer(buffer[i])) {
      throw new TypeError(`crypto.blake2b: Buffer at index ${i} is not buffer.`)
    } else if (0 === buffer[i].length) {
      throw new TypeError(`crypto.blake2b: Buffer at index ${i} is empty.`)
    }
  }

  const digest = alloc(size)
  crypto_generichash_batch(digest, buffer)
  return digest
}

module.exports = {
  blake2b
}
