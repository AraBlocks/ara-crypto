const { box, createBoxStream } = require('../box')
const { randomBytes } = require('../random-bytes')
const increment = require('increment-buffer')
const { unbox } = require('../unbox')
const isBuffer = require('is-buffer')
const test = require('ava')

/* eslint-disable camelcase */
const {
  crypto_secretbox_MACBYTES,
  crypto_secretbox_NONCEBYTES,
} = require('sodium-universal')

test('box(buffer, opts) is a function', (t) => {
  t.true('function' === typeof box)
})

test('box(buffer, opts) throws on bad input', (t) => {
  t.throws(() => box(), TypeError)
  t.throws(() => box(null), TypeError)
  t.throws(() => box(true), TypeError)
  t.throws(() => box(123), TypeError)
  t.throws(() => box('string'), TypeError)
  t.throws(() => box(Buffer.from('hello')), TypeError)
  t.throws(() => box(Buffer.from('hello'), { secret: null }), TypeError)
  t.throws(() => box(Buffer.from('hello'), { key: null }), TypeError)
})

test('box(buffer, opts) basic with key and nonce (detached)', (t) => {
  const buffer = Buffer.from('hello')
  const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
  const key = Buffer.alloc(32)
  key.fill('key')
  const boxed = box(buffer, { nonce, key })

  t.true(isBuffer(boxed))
  t.true(boxed.length === (
    2
    + crypto_secretbox_MACBYTES
    + crypto_secretbox_MACBYTES
    + buffer.length
  ))
})

test('box(buffer, opts) basic secret', (t) => {
  const buffer = Buffer.from('hello')
  const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
  const key = Buffer.alloc(32)
  key.fill('key')
  const secret = Buffer.concat([ key, nonce ])
  const boxed = box(buffer, { secret })

  t.true(isBuffer(boxed))
  t.true(boxed.length === (
    2
    + crypto_secretbox_MACBYTES
    + crypto_secretbox_MACBYTES
    + buffer.length
  ))
})

test('box(buffer, opts) exposes nonce', (t) => {
  const buffer = Buffer.from('hello')
  const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
  const key = Buffer.alloc(32)
  key.fill('key')
  const secret = Buffer.concat([ key, nonce ])
  const boxed = box(buffer, { secret })

  t.true(isBuffer(boxed.nonce))
})

test('createBoxStream(opts) is a function', (t) => {
  t.true('function' === typeof createBoxStream)
})

test('createBoxStream(opts) throws on bad input', (t) => {
  t.throws(() => createBoxStream(null), TypeError)
  t.throws(() => createBoxStream(true), TypeError)
  t.throws(() => createBoxStream(123), TypeError)
  t.throws(() => createBoxStream(), TypeError)
})

test.cb('createBoxStream(opts) returns stream that boxes input', (t) => {
  const key = Buffer.alloc(32)
  const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
  const final = randomBytes(2 + crypto_secretbox_MACBYTES)
  const buffer = Buffer.alloc(2 * 65536)
  const chunks = []

  key.fill('hello')
  buffer.fill('hello')

  const stream = createBoxStream({ key, nonce, final })

  stream.on('data', ondata)
  stream.on('end', onend)
  stream.write(buffer)
  stream.end()

  function ondata(chunk) {
    chunks.push(chunk)
  }

  function onend() {
    const fin = chunks.pop()
    const parts = []

    do {
      const head = chunks.shift()
      const body = chunks.shift()
      const combined = Buffer.concat([ head, body ])
      parts.push(unbox(combined, { key, nonce }))
      increment(nonce)
      increment(nonce)
    } while (chunks.length > 0)

    t.true(0 === Buffer.compare(final, unbox(fin, { key, nonce })))

    const result = Buffer.concat(parts)
    t.true(0 === Buffer.compare(result, buffer))
    t.end()
  }
})
