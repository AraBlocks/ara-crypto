const { auth, verify } = require('../auth')
const { randomBytes } = require('../random-bytes')
const isBuffer = require('is-buffer')
const test = require('ava')

/* eslint-disable camelcase */
const {
  crypto_auth_KEYBYTES,
  crypto_auth_BYTES,
  crypto_auth_verify,
  crypto_auth,
} = require('../sodium')

test('auth(message, key) is a function', (t) => {
  t.true('function' === typeof auth)
})

test('verify(mac, message, key) is a function', (t) => {
  t.true('function' === typeof verify)
})

test('auth.verify(mac, message, key) is a function', (t) => {
  t.true('function' === typeof auth.verify)
  t.true(auth.verify === verify)
})

test('auth(message, key) throws on bad input', (t) => {
  t.throws(() => auth(), TypeError)
  t.throws(() => auth(null, null), TypeError)
  t.throws(() => auth(1, {}), TypeError)
  t.throws(() => auth([], false), TypeError)
  t.throws(() => auth('', Buffer.alloc(0)), TypeError)
  t.throws(() => auth(Buffer.alloc(0), Buffer.alloc(0)), TypeError)
  t.throws(() => auth(Buffer.from('hello'), Buffer.alloc(0)), TypeError)
  t.throws(() => auth(Buffer.from('hello'), Buffer.from('key')), TypeError)
})

test('verify(mac, message, key) throws on bad input', (t) => {
  const hello = Buffer.from('hello')
  const key = Buffer.from('key')
  t.throws(() => verify(), TypeError)
  t.throws(() => verify(null, null), TypeError)
  t.throws(() => verify(1, {}), TypeError)
  t.throws(() => verify([], false), TypeError)
  t.throws(() => verify('', Buffer.alloc(0)), TypeError)
  t.throws(() => verify(Buffer.alloc(0), Buffer.alloc(0)), TypeError)
  t.throws(() => verify(hello, Buffer.alloc(0)), TypeError)
  t.throws(() => verify(hello, key), TypeError)
  t.throws(() => verify(null, Buffer.alloc(0), Buffer.alloc(0)), TypeError)
  t.throws(() => verify(null, hello, Buffer.alloc(0)), TypeError)
  t.throws(() => verify(null, hello, key), TypeError)
  t.throws(() => verify('', hello, key), TypeError)
  t.throws(() => verify(hello, hello, key), TypeError)
})

test('auth(message, key) creates a MAC', (t) => {
  const message = Buffer.from('hello')
  const key = randomBytes(crypto_auth_KEYBYTES)
  const mac = auth(message, key)
  t.true(isBuffer(mac))
  t.true(crypto_auth_BYTES === mac.length)
  t.true(Boolean(crypto_auth_verify(mac, message, key)))
})

test('verify(mac, message, key) verifies a MAC', (t) => {
  const message = Buffer.from('hello')
  const key = randomBytes(crypto_auth_KEYBYTES)
  const mac = auth(message, key)
  t.true(verify(mac, message, key))
  message[0]++
  t.true(false == verify(mac, message, key))
  message[0]--
  t.true(verify(mac, message, key))

  const out = Buffer.allocUnsafe(crypto_auth_BYTES)
  crypto_auth(out, message, key)
  t.true(verify(out, message, key))
})
