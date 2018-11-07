const { randomBytes } = require('../random-bytes')
const isBuffer = require('is-buffer')
const test = require('./helpers/runner')
const kdf = require('../kdf')

/* eslint-disable camelcase */
const {
  crypto_kdf_CONTEXTBYTES,
  crypto_kdf_KEYBYTES,
} = require('sodium-universal')

test.cb('kdf.keygen(key) is a function', (t) => {
  t.true('function' === typeof kdf.keygen)
  t.end()
})

test.cb('kdf.keygen(key) throws on bad input', (t) => {
  t.throws(() => kdf.keygen(null), TypeError)
  t.throws(() => kdf.keygen(1), TypeError)
  t.throws(() => kdf.keygen({}), TypeError)
  t.throws(() => kdf.keygen(''), TypeError)
  t.throws(() => kdf.keygen(true), TypeError)
  t.throws(() => kdf.keygen([]), TypeError)
  t.throws(() => kdf.keygen(() => undefined), TypeError)
  t.throws(() => kdf.keygen(randomBytes(0)), TypeError)
  t.throws(() => kdf.keygen(randomBytes(crypto_kdf_KEYBYTES + 1)), TypeError)
  t.throws(() => kdf.keygen(randomBytes(crypto_kdf_KEYBYTES - 1)), TypeError)
  t.end()
})

test.cb('kdf.keygen(key) returns a key without seed', (t) => {
  const key = kdf.keygen()

  t.true(isBuffer(key))
  t.true(crypto_kdf_KEYBYTES === key.length)
  t.end()
})

test.cb('kdf.keygen(seed) returns a key pair from seed', (t) => {
  const seed = Buffer.allocUnsafe(crypto_kdf_KEYBYTES)
  const k1 = kdf.keygen(seed)
  const k2 = kdf.keygen(seed)

  t.true(isBuffer(k1))
  t.true(isBuffer(k2))
  t.true(isBuffer(seed))
  t.true(crypto_kdf_KEYBYTES === k1.length)
  t.true(crypto_kdf_KEYBYTES === k2.length)
  t.true(0 === Buffer.compare(k1, k2))
  t.true(0 === Buffer.compare(k1, seed))
  t.end()
})

test.cb('kdf.init(buffer, key) is a function', (t) => {
  t.true('function' === typeof kdf.init)
  t.end()
})

test.cb('kdf.init(buffer, key) throws on bad input', (t) => {
  t.throws(() => kdf.init(123), TypeError)
  t.throws(() => kdf.init(true), TypeError)
  t.throws(() => kdf.init(() => undefined), TypeError)
  t.throws(() => kdf.init(''), TypeError)
  t.throws(() => kdf.init({}), TypeError)

  const smallCtx = randomBytes(crypto_kdf_CONTEXTBYTES - 1)
  const largeCtx = randomBytes(crypto_kdf_CONTEXTBYTES + 1)
  t.throws(() => kdf.init(smallCtx), TypeError)
  t.throws(() => kdf.init(largeCtx), TypeError)

  const ctx = randomBytes(crypto_kdf_CONTEXTBYTES)
  t.throws(() => kdf.init(null), TypeError)
  t.throws(() => kdf.init(ctx, 123), TypeError)
  t.throws(() => kdf.init(ctx, true), TypeError)
  t.throws(() => kdf.init(ctx, () => undefined), TypeError)
  t.throws(() => kdf.init(ctx, ''), TypeError)
  t.throws(() => kdf.init(ctx, {}), TypeError)

  const smallKey = randomBytes(crypto_kdf_KEYBYTES - 1)
  const largeKey = randomBytes(crypto_kdf_KEYBYTES + 1)
  t.throws(() => kdf.init(ctx, smallKey), TypeError)
  t.throws(() => kdf.init(ctx, largeKey), TypeError)

  // const smallSubkey = Buffer.allocUnsafe(crypto_kdf_BYTES_MIN - 1)
  // const largeSubkey = Buffer.allocUnsafe(crypto_kdf_BYTES_MAX + 1)
  // t.throws(() => kdf.init(smallSubkey), TypeError)
  // t.throws(() => kdf.init(largeSubkey), TypeError)

  // const subkey = Buffer.allocUnsafe(crypto_kdf_KEYBYTES)
  // t.throws(() => kdf.init(subkey, -1), TypeError)
  t.end()
})

test.cb('kdf.init(buffer, key) returns a context object without a context buffer.', (t) => {
  const buffer = null
  const key = randomBytes(crypto_kdf_KEYBYTES)
  const ctx = kdf.init(buffer, key)

  t.true('object' === typeof ctx)
  t.true(null === ctx.subkey)
  t.true(isBuffer(ctx.buffer))
  t.true(isBuffer(ctx.key))
  t.true(crypto_kdf_CONTEXTBYTES === ctx.buffer.length)
  t.true(crypto_kdf_KEYBYTES === ctx.key.length)
  t.true(0 === Buffer.compare(key, ctx.key))
  t.end()
})

test.cb('kdf.init(buffer, key) returns a context object with a context buffer.', (t) => {
  const buffer = randomBytes(crypto_kdf_CONTEXTBYTES)
  const key = randomBytes(crypto_kdf_KEYBYTES)
  const c1 = kdf.init(buffer, key)
  const c2 = kdf.init(buffer, key)

  t.true('object' === typeof c1)
  t.true(null === c1.subkey)
  t.true(null === c2.subkey)
  t.true(isBuffer(c1.buffer))
  t.true(isBuffer(c1.key))
  t.true(crypto_kdf_CONTEXTBYTES === c1.buffer.length)
  t.true(crypto_kdf_KEYBYTES === c1.key.length)
  t.true(0 === Buffer.compare(buffer, c1.buffer))
  t.true(0 === Buffer.compare(buffer, c2.buffer))
  t.true(0 === Buffer.compare(key, c1.key))
  t.true(0 === Buffer.compare(key, c2.key))
  t.end()
})

test.cb('kdf.update(ctx, id) is a function', (t) => {
  t.true('function' === typeof kdf.update)
  t.end()
})

test.cb('kdf.update(ctx, id) throws on bad input', (t) => {
  t.throws(() => kdf.update(123), TypeError)
  t.throws(() => kdf.update(true), TypeError)
  t.throws(() => kdf.update(() => undefined), TypeError)
  t.throws(() => kdf.update(''), TypeError)
  t.throws(() => kdf.update({}), TypeError)
  t.throws(() => kdf.update({ subkey: 123 }), TypeError)
  t.throws(() => kdf.update({ subkey: true }), TypeError)
  t.throws(() => kdf.update({ subkey: () => undefined }), TypeError)
  t.throws(() => kdf.update({ subkey: '' }), TypeError)
  t.throws(() => kdf.update({ subkey: {} }), TypeError)
  t.throws(() => kdf.update({ buffer: 123 }), TypeError)
  t.throws(() => kdf.update({ buffer: true }), TypeError)
  t.throws(() => kdf.update({ buffer: () => undefined }), TypeError)
  t.throws(() => kdf.update({ buffer: '' }), TypeError)
  t.throws(() => kdf.update({ buffer: {} }), TypeError)

  const smallCtx = randomBytes(crypto_kdf_CONTEXTBYTES - 1)
  const largeCtx = randomBytes(crypto_kdf_CONTEXTBYTES + 1)
  t.throws(() => kdf.update({ buffer: smallCtx }), TypeError)
  t.throws(() => kdf.update({ buffer: largeCtx }), TypeError)

  const buffer = randomBytes(crypto_kdf_CONTEXTBYTES)
  t.throws(() => kdf.update({ buffer, key: 123 }), TypeError)
  t.throws(() => kdf.update({ buffer, key: true }), TypeError)
  t.throws(() => kdf.update({ buffer, key: () => undefined }), TypeError)
  t.throws(() => kdf.update({ buffer, key: '' }), TypeError)
  t.throws(() => kdf.update({ buffer, key: {} }), TypeError)

  const smallKey = randomBytes(crypto_kdf_KEYBYTES - 1)
  const largeKey = randomBytes(crypto_kdf_KEYBYTES + 1)
  t.throws(() => kdf.update({ buffer, key: smallKey }), TypeError)
  t.throws(() => kdf.update({ buffer, key: largeKey }), TypeError)

  const key = randomBytes(crypto_kdf_KEYBYTES)
  const ctx = { buffer, key }
  t.throws(() => kdf.update(ctx, true), TypeError)
  t.throws(() => kdf.update(ctx, () => undefined), TypeError)
  t.throws(() => kdf.update(ctx, ''), TypeError)
  t.throws(() => kdf.update(ctx, {}), TypeError)
  t.throws(() => kdf.update(ctx, -1), TypeError)
  t.throws(() => kdf.update(ctx, 2 ** 65), TypeError)

  t.end()
})

test.cb('kdf.update(ctx, id) returns an updated subkey with ID', (t) => {
  const buffer = randomBytes(crypto_kdf_CONTEXTBYTES)
  const key = randomBytes(crypto_kdf_KEYBYTES)
  const subkey = null
  const ctx = { buffer, key, subkey }
  const s1 = kdf.update(ctx, 2)

  ctx.subkey = null
  const s2 = kdf.update(ctx, 2)

  t.true(isBuffer(s1))
  t.true(isBuffer(s2))
  t.true(isBuffer(ctx.subkey))
  t.true(crypto_kdf_KEYBYTES === s1.length)
  t.true(crypto_kdf_KEYBYTES === s2.length)
  t.true(crypto_kdf_KEYBYTES === ctx.subkey.length)
  t.true(0 === Buffer.compare(s1, s2))
  t.true(0 === Buffer.compare(s1, ctx.subkey))
  t.end()
})

test.cb('kdf.final(ctx) is a function', (t) => {
  t.true('function' === typeof kdf.final)
  t.end()
})

test.cb('kdf.final(ctx) throws on bad input', (t) => {
  t.throws(() => kdf.final(), TypeError)
  t.throws(() => kdf.final(123), TypeError)
  t.throws(() => kdf.final(true), TypeError)
  t.throws(() => kdf.final(() => undefined), TypeError)
  t.throws(() => kdf.final(''), TypeError)

  t.end()
})

test.cb('kdf.final(ctx) returns subkey from context', (t) => {
  const subkey = randomBytes(crypto_kdf_KEYBYTES)
  const ctx = { subkey }
  const s = kdf.final(ctx)

  t.true(isBuffer(s))
  t.true(null === ctx.subkey)
  t.end()
})

test.cb('kdf.derive(buffer, key, iterations) is a function', (t) => {
  t.true('function' === typeof kdf.derive)
  t.end()
})

test.cb('kdf.derive(buffer, key, iterations) throws on bad input', (t) => {
  const buffer = randomBytes(crypto_kdf_CONTEXTBYTES)
  const key = randomBytes(crypto_kdf_KEYBYTES)

  t.throws(() => kdf.derive(buffer, key), TypeError)
  t.throws(() => kdf.derive(buffer, key, true), TypeError)
  t.throws(() => kdf.derive(buffer, key, () => undefined), TypeError)
  t.throws(() => kdf.derive(buffer, key, ''), TypeError)
  t.throws(() => kdf.derive(buffer, key, {}), TypeError)
  t.throws(() => kdf.derive(buffer, key, 0), TypeError)
  t.throws(() => kdf.derive(buffer, key, 2 ** 65), TypeError)

  t.end()
})

test.cb('kdf.derive(buffer, key, iterations) returns a derived subkey', (t) => {
  const buffer = randomBytes(crypto_kdf_CONTEXTBYTES)
  const key = kdf.keygen()

  const k1 = kdf.derive(buffer, key, 2)
  const k2 = kdf.derive(buffer, key, 2)

  t.true(isBuffer(k1))
  t.true(isBuffer(k2))
  t.true(crypto_kdf_KEYBYTES === k1.length)
  t.true(crypto_kdf_KEYBYTES === k2.length)
  t.true(0 === Buffer.compare(k1, k2))

  t.end()
})
