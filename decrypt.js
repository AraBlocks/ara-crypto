const { createDecipheriv, createHmac } = require('crypto')
const isBuffer = require('is-buffer')
const uint64 = require('./uint64')

const {
  kVersion,
  kDefaultCipher,
  kDefaultDigest,
} = require('./constants')

/**
 * Decrypt an encrypted "crypto" object into the originally
 * encoded buffer.
 * @public
 * @param {Object} value
 * @param {Object} opts
 * @param {Buffer} opts.iv
 * @param {Buffer} opts.key
 * @param {?(String)} opts.cipher
 * @param {?(String)} opts.digest
 * @return {Buffer}
 */
function decrypt(value, opts) {
  if (null == value) {
    throw new TypeError('crypto.decrypt: Encrypted value cannot be null.')
  } else if (isBuffer(value)) {
    throw new TypeError('crypto.decrypt: Encrypted value cannot be a buffer.')
  } else if (!value || 'object' !== typeof value) {
    throw new TypeError('crypto.decrypt: Encrypted value to be an object.')
  }

  if (null == value.version || 'string' !== typeof value.version) {
    throw new TypeError('crypto.decrypt: Missing encryption version.')
  }

  if (null == value.id || 'string' !== typeof value.id) {
    throw new TypeError('crypto.decrypt: Missing encryption ID.')
  }

  if (null == value.crypto || 'object' !== typeof value.crypto) {
    /* eslint-disable function-paren-newline */
    throw new TypeError(
      'crypto.decrypt: Missing encryption crypto specification object.')
  }

  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('crypto.decrypt: Expecting options object.')
  }

  if (!opts.key) {
    throw new TypeError('crypto.decrypt: Expecting decryption key.')
  } else if ('string' !== typeof opts.key && false === isBuffer(opts.key)) {
    /* eslint-disable function-paren-newline */
    throw new TypeError(
      'crypto.decrypt: Expecting decryption key to be a string or buffer.')
  }

  if (!opts.cipher || 'string' !== typeof opts.cipher) {
    /* eslint-disable no-param-reassign */
    opts.cipher = kDefaultCipher
  }

  if (!opts.digest || 'string' !== typeof opts.digest) {
    /* eslint-disable no-param-reassign */
    opts.digest = kDefaultDigest
  }

  if ('string' !== typeof opts.cipher) {
    throw new TypeError('crypto.decrypt: Expecting cipher type to be a string.')
  }

  if ('string' !== typeof opts.digest) {
    throw new TypeError('crypto.decrypt: Expecting digest type to be a string.')
  }

  if (opts.strict) {
    const version = uint64.encode(kVersion).toString('hex')
    if (version !== value.version) {
      /* eslint-disable function-paren-newline */
      throw new TypeError(
        'crypto.decrypt: Encryption version does not match (strict).')
    }
  }

  let { iv = opts.iv } = value.crypto.cipherparams
  const { digest = opts.digest } = value.crypto
  const { cipher = opts.cipher } = value.crypto
  const { key } = opts

  if (null == iv) {
    throw new TypeError('crypto.decrypt: Expecting decryption iv.')
  } else if ('string' !== typeof iv && false === isBuffer(iv)) {
    /* eslint-disable function-paren-newline */
    throw new TypeError(
      'crypto.decrypt: Expecting decryption iv to be a string or buffer.')
  }

  if ('string' === typeof iv) {
    iv = Buffer.from(iv, 'hex')
  }

  const decipheriv = createDecipheriv(cipher, key, iv)
  const hmac = createHmac(digest, key)
  const buffer = Buffer.from(value.crypto.ciphertext, 'hex')

  hmac.write(buffer)
  hmac.end()

  const mac = hmac.read().toString('hex')

  if (mac !== value.crypto.mac) {
    throw new TypeError('crypto.decrypt: HMAC digest does not match.')
  }

  return Buffer.concat([
    decipheriv.update(buffer),
    decipheriv.final(),
  ])
}

module.exports = {
  decrypt
}
