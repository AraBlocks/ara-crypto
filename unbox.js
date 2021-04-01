const increment = require('increment-buffer')
const isBuffer = require('is-buffer')
const through = require('through2')

/* eslint-disable camelcase */
const {
  crypto_secretbox_KEYBYTES,
  crypto_secretbox_MACBYTES,
  crypto_secretbox_NONCEBYTES,

  crypto_secretbox_open_easy,
} = require('./sodium')

const kBoxHeaderSize = 2 + (2 * crypto_secretbox_MACBYTES)

/**
 * "Unboxes" or decrypts a buffer from a 32-byte encryption key and
 * a 24-byte nonce.
 *
 * @public
 * @param {Object} opts
 * @param {?(Buffer)} opts.secret
 * @param {?(Buffer)} opts.nonce
 * @param {?(Buffer)} opts.key
 * @return {Buffer}
 * @throws TypeError
 */
function unbox(buffer, opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('crypto.unbox: Expecting object.')
  }

  const { secret } = opts
  let { nonce, key } = opts

  if (isBuffer(secret) && secret.length >= crypto_secretbox_KEYBYTES) {
    key = secret.slice(0, crypto_secretbox_KEYBYTES)
    nonce = isBuffer(opts.nonce)
      ? opts.nonce
      : secret.slice(crypto_secretbox_KEYBYTES)
  }

  if (false === isBuffer(nonce)) {
    throw new TypeError('crypto.unbox: Expecting nonce.')
  }

  if (false === isBuffer(key)) {
    throw new TypeError('crypto.unbox: Expecting secret key.')
  }
  
  key = key.slice(0, crypto_secretbox_KEYBYTES)
  const nonces = [ copy(nonce), increment(copy(nonce)) ]
  const header = Buffer.allocUnsafe(2 + crypto_secretbox_MACBYTES)

  crypto_secretbox_open_easy(
    header,
    buffer.slice(0, 2 + (2 * crypto_secretbox_MACBYTES)),
    nonces[0].slice(0, crypto_secretbox_NONCEBYTES),
    key
  )

  if (0 === Buffer.compare(header, zeroes(header.length))) {
    return null
  }

  const length = header.readUInt16BE(0)
  const combined = Buffer.concat([
    // MAC
    header.slice(2, crypto_secretbox_MACBYTES + header.length),
    // body
    buffer.slice(crypto_secretbox_MACBYTES + header.length),
  ])

  const unboxed = Buffer.alloc(length)

  // unbox combined
  crypto_secretbox_open_easy(
    unboxed,
    combined,
    nonces[1].slice(0, crypto_secretbox_NONCEBYTES),
    key
  )

  return Object.assign(unboxed, { nonce })
}

/**
 * Creates a transform stream that "unboxes" messages written to it.
 *
 * @public
 * @param {Object} opts
 * @param {?(Buffer)} opts.secret
 * @param {?(Buffer)} opts.nonce
 * @param {?(Buffer)} opts.key
 * @return {Stream}
 * @throws TypeError
 */
function createUnboxStream(opts) {
  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('crypto.box: Expecting object.')
  }

  // create new reference
  /* eslint-disable-next-line no-param-reassign */
  opts = { ...opts }

  if (false === isBuffer(opts.nonce)) {
    throw new TypeError('crypto.createUnboxStream: Expecting nonce.')
  }

  const backlog = []

  Object.assign(opts, { nonce: copy(opts.nonce) })

  return through(transform)

  function transform(chunk, enc, done) {
    // group packets together
    if (kBoxHeaderSize === chunk.length) {
      backlog.push(chunk)
    } else if (backlog.length) {
      const head = backlog.shift()
      const body = chunk
      const combined = Buffer.concat([ head, body ])
      const unboxed = unbox(combined, opts)

      increment(opts.nonce)
      increment(opts.nonce)

      this.push(unboxed)
    } else {
      const unboxed = unbox(chunk, opts)

      increment(opts.nonce)
      increment(opts.nonce)

      this.push(unboxed)
    }

    done(null)
  }
}

function zeroes(n) {
  const z = Buffer.allocUnsafe(n)
  z.fill(0)
  return z
}

function copy(x) {
  const y = Buffer.allocUnsafe(x.length)
  x.copy(y, 0, 0, x.length)
  return y
}

module.exports = {
  createUnboxStream,
  unbox,
}
