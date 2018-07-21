/* eslint-disable camelcase */
const { randombytes_buf } = require('sodium-universal')
const alloc = require('buffer-alloc-unsafe')

/**
 * Generate a sized buffer of random bytes. This function calls
 * `randombytes_buf` on a buffer of specified size.
 *
 * @public
 * @param {Number} size
 * @return {Buffer}
 * @throws TypeError
 */
function randomBytes(size) {
  if (Number.isNaN(size)) {
    throw new TypeError('crypto.randomBytes: Size cannot be NaN.')
  } else if (!size || 'number' !== typeof size) {
    throw new TypeError('crypto.randomBytes: Expecting size to be a number.')
  } else if (size <= 0) {
    throw new TypeError('crypto.randomBytes: Size must be larger than 0.')
  }

  const buffer = alloc(size)
  randombytes_buf(buffer)
  return buffer
}

module.exports = {
  randomBytes
}
