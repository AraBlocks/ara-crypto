const increment = require('increment-buffer')
const isBuffer = require('is-buffer')
const through = require('through2')
const split = require('split-buffer')

/* eslint-disable camelcase */
const {
  crypto_secretbox_KEYBYTES,
  crypto_secretbox_MACBYTES,
  crypto_secretbox_NONCEBYTES,

  crypto_secretbox_easy,
} = require('./sodium')

const kBoxHeaderSize = 2 + (2 * crypto_secretbox_MACBYTES)
const kBoxBufferSize = 4 * 1024

/**
 * "Boxes", or encrypts, a buffer from a 32 byte encryption key
 * and a 24-byte nonce.
 *
 * @public
 * @param {Buffer} buffer
 * @param {Object} opts
 * @param {Buffer} opts.buffer
 * @param {?(Buffer)} opts.secret
 * @param {?(Buffer)} opts.nonce
 * @param {?(Buffer)} opts.key
 * @return {Buffer}
 * @throws TypeError
 */
function box(buffer, opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('crypto.box: Expecting object.')
  }

  const { secret } = opts
  let { nonce, key } = opts

  if (!buffer || false === isBuffer(buffer)) {
    throw new TypeError('crypto.box: Expecting buffer.')
  }

  if (isBuffer(secret) && secret.length >= crypto_secretbox_KEYBYTES) {
    key = secret.slice(0, crypto_secretbox_KEYBYTES)
    nonce = isBuffer(opts.nonce)
      ? opts.nonce
      : secret.slice(crypto_secretbox_KEYBYTES)
  }

  if (false === isBuffer(nonce)) {
    throw new TypeError('crypto.box: Expecting nonce.')
  }

  if (false === isBuffer(key)) {
    throw new TypeError('crypto.box: Expecting secret key.')
  }

  // ephemeral nonces used for header and body buffer boxing
  const nonces = [ copy(nonce), increment(copy(nonce)) ]

  // length(2) + MAC(16) == 18
  const header = Buffer.alloc(2 + crypto_secretbox_MACBYTES)

  // boxed buffer cipher text
  const body = Buffer.alloc(crypto_secretbox_MACBYTES + buffer.length)

  // output buffer frames
  const frames = [
    Buffer.alloc(crypto_secretbox_MACBYTES + header.length),
    Buffer.alloc(buffer.length),
  ]

  // write buffer length into header
  header.writeUInt16BE(buffer.length, 0)

  // box message buffer
  crypto_secretbox_easy(body, buffer, nonces[1].subarray(0, crypto_secretbox_NONCEBYTES), key)

  // copy MAC into header after length (offset 2)
  body.copy(
    header,
    2,
    0,
    crypto_secretbox_MACBYTES
  )

  // copy boxed message buffer into frames[1]
  body.copy(
    frames[1],
    0,
    crypto_secretbox_MACBYTES,
    crypto_secretbox_MACBYTES + buffer.length
  )

  // box header buffer into frame[0] based on current nonces[0] and key
  crypto_secretbox_easy(frames[0], header, nonces[0].subarray(0, crypto_secretbox_NONCEBYTES), key)

  return Object.assign(Buffer.concat(frames), { nonce: nonces[1] })
}

/**
 * Creates a transform stream that "boxes" messages
 * written to it.
 *
 * @public
 * @param {Object} opts
 * @param {?(Buffer)} opts.secret
 * @param {?(Buffer)} opts.nonce
 * @param {?(Buffer)} opts.key
 * @return {Stream}
 * @throws TypeError
 */
function createBoxStream(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('crypto.box: Expecting object.')
  }

  // create new reference
  /* eslint-disable-next-line no-param-reassign */
  opts = Object.assign({}, opts)

  if (false === isBuffer(opts.nonce)) {
    throw new TypeError('crypto.createBoxStream: Expecting nonce.')
  }

  return through(transform)

  function transform(buffer, enc, done) {
    const chunks = split(buffer, kBoxBufferSize)

    for (const chunk of chunks) {
      const offset = kBoxHeaderSize
      const boxed = box(chunk, opts)
      const nonce = increment(copy(boxed.nonce))
      const head = boxed.slice(0, offset)
      const body = boxed.slice(offset)

      this.push(head)
      this.push(body)

      Object.assign(opts, { nonce })
    }

    done(null)
  }
}

function copy(x) {
  const y = Buffer.allocUnsafe(x.length)
  x.copy(y, 0, 0, x.length)
  return y
}

module.exports = {
  createBoxStream,
  box,
}
