const { keyPair, verify, sign } = require('../ed25519')
const isBuffer = require('is-buffer')
const test = require('ava')

/* eslint-disable camelcase */
const {
  crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SEEDBYTES,
  crypto_sign_BYTES,
} = require('sodium-universal')

test('ed25519.keyPair(seed)', (t) => {
  t.throws(() => keyPair(null), TypeError)
  t.throws(() => keyPair(0), TypeError)
  t.throws(() => keyPair(''), TypeError)
  t.throws(() => keyPair(true), TypeError)
  t.throws(() => keyPair([]), TypeError)
  t.throws(() => keyPair(Buffer.alloc(0)), TypeError)
  t.throws(() => keyPair(Buffer.alloc(crypto_sign_SEEDBYTES + 1)), TypeError)
  t.throws(() => keyPair(Buffer.alloc(crypto_sign_SEEDBYTES - 1)), TypeError)
  t.true('object' === typeof keyPair())
  t.true('object' === typeof keyPair(Buffer.alloc(32).fill('hello')))
  t.true(isBuffer(keyPair().publicKey))
  t.true(isBuffer(keyPair().secretKey))
  t.true(32 === keyPair().publicKey.length)
  t.true(64 === keyPair().secretKey.length)
})

test('ed25519.verify(signature, message, publicKey)', (t) => {
  const { publicKey, secretKey } = keyPair()

  t.throws(() => verify(0, 0, 0), TypeError)
  t.throws(() => verify(null, 0, 0), TypeError)
  t.throws(() => verify([], 0, 0), TypeError)
  t.throws(() => verify(true, 0, 0), TypeError)
  t.throws(() => verify('', 0, 0), TypeError)
  t.throws(() => verify(Buffer.alloc(0), 0, 0), TypeError)

  const message = Buffer.from('message')

  t.throws(() => verify(0, message, 0, 0), TypeError)
  t.throws(() => verify(0, message, null, 0), TypeError)
  t.throws(() => verify(0, message, true, 0), TypeError)
  t.throws(() => verify(0, message, '', 0), TypeError)
  t.throws(() => verify(0, message, Buffer.alloc(0)), TypeError)
  t.throws(() => verify(0, message, Buffer.alloc(8)), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES),
    message,
    Buffer.alloc(crypto_sign_PUBLICKEYBYTES + 1)
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES),
    message,
    Buffer.alloc(crypto_sign_PUBLICKEYBYTES - 1)
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES),
    message,
    null
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES),
    message,
    Buffer.alloc(0)
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES + 1),
    message,
    Buffer.alloc(crypto_sign_PUBLICKEYBYTES)
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES - 1),
    message,
    Buffer.alloc(crypto_sign_PUBLICKEYBYTES)
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES),
    Buffer.alloc(0),
    Buffer.alloc(crypto_sign_PUBLICKEYBYTES)
  ), TypeError)

  t.throws(() => verify(
    Buffer.alloc(crypto_sign_BYTES),
    null,
    Buffer.alloc(crypto_sign_PUBLICKEYBYTES)
  ), TypeError)

  const signature = sign(message, secretKey)

  t.throws(() => verify(signature, message, 0), TypeError)
  t.throws(() => verify(signature, message, null), TypeError)
  t.throws(() => verify(signature, message, []), TypeError)
  t.throws(() => verify(signature, message, true), TypeError)
  t.throws(() => verify(signature, message, ''), TypeError)

  t.true(verify(signature, message, publicKey))
})

test('ed25519.sign(message, secretKey)', (t) => {
  t.throws(() => sign(0, 0), TypeError)
  t.throws(() => sign(null, 0), TypeError)
  t.throws(() => sign(true, 0), TypeError)
  t.throws(() => sign([], 0), TypeError)
  t.throws(() => sign('', 0), TypeError)
  t.throws(() => sign(Buffer.alloc(0), 0), TypeError)

  t.throws(() => sign(Buffer.from('message'), 0), TypeError)
  t.throws(() => sign(Buffer.from('message'), null), TypeError)
  t.throws(() => sign(Buffer.from('message'), true), TypeError)
  t.throws(() => sign(Buffer.from('message'), []), TypeError)
  t.throws(() => sign(Buffer.from('message'), ''), TypeError)
  t.throws(() => sign(Buffer.from('message'), Buffer.alloc(0)), TypeError)

  t.throws(() => sign(
    Buffer.from('message'),
    null,
  ), TypeError)

  const { secretKey } = keyPair()

  t.true(isBuffer(sign(Buffer.from('message'), secretKey)))
})
