const isBuffer = require('is-buffer')
const { shash } = require('../shash')
const test = require('ava')

/* eslint-disable camelcase */
const {
  crypto_shorthash_KEYBYTES,
  crypto_shorthash_BYTES,
} = require('sodium-universal')

test('shash(message, secretKey) is a function', (t) => {
  t.true('function' === typeof shash)
})

test('shash(message, secretKey) throws on bad input', (t) => {
  t.throws(() => shash(), TypeError)
  t.throws(() => shash(null, null), TypeError)
  t.throws(() => shash(123, null), TypeError)
  t.throws(() => shash(true, null), TypeError)
  t.throws(() => shash('hello', null), TypeError)
  t.throws(() => shash(Buffer.alloc(0), null), TypeError)
  t.throws(() => shash(Buffer.alloc(8), null), TypeError)
  t.throws(() => shash(Buffer.alloc(8), true), TypeError)
  t.throws(() => shash(Buffer.alloc(8), 123), TypeError)
  t.throws(() => shash(Buffer.alloc(8), 'hello'), TypeError)
  t.throws(() => shash(Buffer.alloc(8), 'hello'), TypeError)
  t.throws(() => shash(Buffer.alloc(8), Buffer.alloc(0)), RangeError)
  t.throws(() => shash(
    Buffer.alloc(8),
    Buffer.alloc(crypto_shorthash_KEYBYTES + 1)
  ), RangeError)

  t.throws(() => shash(
    Buffer.alloc(0),
    Buffer.alloc(crypto_shorthash_KEYBYTES)
  ), RangeError)
})

test('shash(message, secretKey) simple', (t) => {
  const message = Buffer.from('hello')
  const key = Buffer.alloc(crypto_shorthash_KEYBYTES).fill('secret')
  const hash = shash(message, key)
  t.true(isBuffer(hash))
  t.true(crypto_shorthash_BYTES === hash.length)
  t.true(0 === Buffer.compare(hash, shash(message, key)))
  t.true(0 !== Buffer.compare(shash(hash, key), shash(message, key)))
})
