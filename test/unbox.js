const { unbox, createUnboxStream } = require('../unbox')
const { box, createBoxStream } = require('../box')
const { randomBytes } = require('../random-bytes')
const isBuffer = require('is-buffer')
const test = require('ava')

/* eslint-disable camelcase */
const {
  crypto_secretbox_NONCEBYTES,
  crypto_secretbox_MACBYTES,
} = require('sodium-universal')

test('unbox(opts) is a function', (t) => {
  t.true('function' === typeof unbox)
})

test('unbox(opts) throws on bad input', (t) => {
  t.throws(() => unbox(), TypeError)
  t.throws(() => unbox(null), TypeError)
  t.throws(() => unbox(true), TypeError)
  t.throws(() => unbox(123), TypeError)
  t.throws(() => unbox('string'), TypeError)
  t.throws(() => unbox({ secret: null }), TypeError)
  t.throws(() => unbox({ key: null }), TypeError)
})

test('unbox(opts) basic with key', (t) => {
  const buffer = Buffer.from('hello')
  const nonce = randomBytes(24)
  const key = Buffer.alloc(32)
  key.fill('key')
  const boxed = box(buffer, { nonce, key })
  const unboxed = unbox(boxed, { nonce, key })
  t.true(isBuffer(unboxed))
  t.true(0 == Buffer.compare(buffer, unboxed))
})

test('unbox(opts) basic with secret', (t) => {
  const buffer = Buffer.from('hello')
  const nonce = randomBytes(24)
  const key = Buffer.alloc(32)
  key.fill('key')
  const secret = Buffer.concat([ key, nonce ])
  const boxed = box(buffer, { secret })
  const unboxed = unbox(boxed, { secret })
  t.true(isBuffer(unboxed))
  t.true(0 == Buffer.compare(buffer, unboxed))
})

test('createUnboxStream(opts) is a function', (t) => {
  t.true('function' === typeof createUnboxStream)
})

test('createUnboxStream(opts) throws on bad input', (t) => {
  t.throws(() => createUnboxStream(null), TypeError)
  t.throws(() => createUnboxStream(true), TypeError)
  t.throws(() => createUnboxStream(123), TypeError)
  t.throws(() => createUnboxStream(), TypeError)
})

test.cb('createUnboxStream(opts) returns stream that unboxes piped input', (t) => {
  const key = Buffer.alloc(32)
  const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
  const final = randomBytes(2 + crypto_secretbox_MACBYTES)
  const buffer = Buffer.alloc(2 * 65536)
  const chunks = []

  key.fill('hello')
  buffer.fill('hello')

  const boxer = createBoxStream({ key, nonce, final })
  const unboxer = createUnboxStream({ key, nonce, final })

  unboxer.on('data', ondata)
  unboxer.on('end', onend)

  boxer.pipe(unboxer)
  boxer.write(buffer)
  boxer.end()

  function ondata(chunk) {
    chunks.push(chunk)
  }

  function onend() {
    t.true(0 === Buffer.compare(chunks.pop(), final))
    t.true(0 === Buffer.compare(Buffer.concat(chunks), buffer))
    t.end()
  }
})

test.cb('createUnboxStream(opts) returns stream that unboxes boxed input', (t) => {
  const key = Buffer.alloc(32)
  const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
  const final = randomBytes(2 + crypto_secretbox_MACBYTES)
  //const buffer = Buffer.alloc(2 * 65536)
  const buffer = Buffer.from('hello')
  const chunks = []

  key.fill('hello')
  buffer.fill('hello')

  const boxed = box(buffer, { key, nonce })
  const unboxer = createUnboxStream({ key, nonce, final })

  unboxer.on('data', ondata)
  unboxer.on('end', onend)

  unboxer.write(boxed.slice(0, 2 + (2 * crypto_secretbox_MACBYTES)))
  unboxer.write(boxed.slice(2 + (2 * crypto_secretbox_MACBYTES)))
  unboxer.end()

  function ondata(chunk) {
    t.true(0 === Buffer.compare(chunk, buffer))
  }

  function onend() {
    t.end()
  }
})
