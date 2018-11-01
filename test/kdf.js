const { randomBytes } = require('../random-bytes')
const isBuffer = require('is-buffer')
const test = require('./helpers/runner')
const kdf = require('../kdf')

/* eslint-disable camelcase */
const {
  crypto_kdf_CONTEXTBYTES,
  crypto_kdf_BYTES_MAX,
  crypto_kdf_BYTES_MIN,
  crypto_kdf_PRIMITIVE,
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

test.cb('kdf.derive(subkey, subkeyId, ctx, key) is a function', (t) => {
  t.true('function' === typeof kdf.derive)
  t.end()
})

test.cb('kdf.derive(subkey, subkeyId, ctx, key) throws on bad input', (t) => {
  t.throws(() => kdf.derive(), TypeError)
  t.throws(() => kdf.derive(null), TypeError)
  t.throws(() => kdf.derive(123), TypeError)
  t.throws(() => kdf.derive(true), TypeError)
  t.throws(() => kdf.derive(() => undefined), TypeError)
  t.throws(() => kdf.derive(''), TypeError)
  t.throws(() => kdf.derive({}), TypeError)
  t.throws(() => kdf.derive(Buffer.allocUnsafe(crypto_kdf_BYTES_MIN - 1)), TypeError)
  t.throws(() => kdf.derive(Buffer.allocUnsafe(crypto_kdf_BYTES_MAX + 1)), TypeError)
  t.throws(() => kdf.derive(undefined, -1), TypeError)
  t.throws(() => kdf.derive(undefined, 2**64), TypeError)
  t.throws(() => kdf.derive(undefined, 0), TypeError)
  t.throws(() => kdf.derive(undefined, 0, randomBytes(crypto_kdf_CONTEXTBYTES - 1)), TypeError)
  t.throws(() => kdf.derive(undefined, 0, randomBytes(crypto_kdf_CONTEXTBYTES + 1)), TypeError)
  t.throws(() => kdf.derive(undefined, 0, randomBytes(crypto_kdf_CONTEXTBYTES)), TypeError)
  t.throws(() => kdf.derive(undefined, 0, randomBytes(crypto_kdf_CONTEXTBYTES), 'hi'), TypeError)
  t.throws(() => kdf.derive(undefined, 0, randomBytes(crypto_kdf_CONTEXTBYTES), randomBytes(crypto_kdf_KEYBYTES - 1)), TypeError)
  t.throws(() => kdf.derive(undefined, 0, randomBytes(crypto_kdf_CONTEXTBYTES), randomBytes(crypto_kdf_KEYBYTES + 1)), TypeError)

  t.end()
})

test.cb('kdf.derive(subkey, subkeyId, ctx, key) returns a key pair from seed', (t) => {
  const seed = randomBytes(crypto_kdf_KEYBYTES)
  const subkey = Buffer.allocUnsafe(crypto_kdf_KEYBYTES)
  const subkeyId = 1
  const ctx = randomBytes(crypto_kdf_CONTEXTBYTES)
  const key = kdf.keygen(seed)

  const k1 = kdf.derive(subkey, subkeyId, ctx, key)
  const k2 = kdf.derive(subkey, subkeyId, ctx, key)

  t.true(isBuffer(k1))
  t.true(isBuffer(k2))
  t.true(isBuffer(seed))
  t.true(crypto_kdf_KEYBYTES === k1.length)
  t.true(crypto_kdf_KEYBYTES === k2.length)
  t.true(0 === Buffer.compare(k1, k2))
  t.true(0 === Buffer.compare(k1, subkey))

  t.end()
})
