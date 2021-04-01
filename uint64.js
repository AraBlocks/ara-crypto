const isBuffer = require('is-buffer')
const uint64be = require('uint64be')
const alloc = require('buffer-alloc-unsafe')

const kMinUInt64Size = 8
const kDefaultUInt64Size = kMinUInt64Size

/**
 * Encode an unsigned 64-bit big endian number into a buffer
 * of a given size defaulting to 8 bytes.
 *
 * @public
 * @param {Number} value
 * @param {?(Number)} size
 * @return {Buffer}
 * @throws {TypeError}
 */
function encode(value, size) {
  /* eslint-disable no-param-reassign */
  if (null == size) { size = kDefaultUInt64Size }
  if ('number' !== typeof size || size < kMinUInt64Size) {
    /* eslint-disable-next-line  function-paren-newline */
    throw new TypeError(
      'crypto.uint64.encode: Expecting size to greater than 8.'
    )
  } else if (Number.isNaN(value)) {
    throw new TypeError('crypto.uint64.encode: Cannot encode NaN.')
  } else if ('number' !== typeof value) {
    throw new TypeError('crypto.uint64.encode: Expecting number.')
  }
  return uint64be.encode(value, alloc(size))
}

/**
 * Decode an unsigned 64-bit big endian buffer into a number
 * @public
 * @param {Number} value
 * @return {Buffer}
 * @throws {TypeError}
 */
function decode(buffer) {
  if (false === isBuffer(buffer)) {
    throw new TypeError('crypto.uint64.decode: Expecting buffer.')
  } else if (0 === buffer.length) {
    /* eslint-disable-next-line  function-paren-newline */
    throw new TypeError(
      'crypto.uint64.decode: Cannot decode buffer of 0 length.'
    )
  }
  return uint64be.decode(buffer)
}

module.exports = {
  encode,
  decode,
}
