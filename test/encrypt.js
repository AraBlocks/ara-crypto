const { randomBytes } = require('../random-bytes')
const { encrypt } = require('../encrypt')
const uint64 = require('../uint64')
const test = require('ava')

const {
  kDefaultCipher,
  kDefaultDigest,
  kVersion,
} = require('../constants')

test('encrypt(opts)', async (t) => {
  const iv = randomBytes(16)
  const key = Buffer.alloc(16).fill('key')

  t.throws(() => encrypt(), TypeError)
  t.throws(() => encrypt(null), TypeError)
  t.throws(() => encrypt(42), TypeError)
  t.throws(() => encrypt(true), TypeError)
  t.throws(() => encrypt({}), TypeError)

  t.throws(() => encrypt('hello', null))
  t.throws(() => encrypt('hello', {}))
  t.throws(() => encrypt('hello', true))
  t.throws(() => encrypt('hello', 42))
  t.throws(() => encrypt('hello', { iv: null }))
  t.throws(() => encrypt('hello', { iv: {} }))
  t.throws(() => encrypt('hello', { iv: 16 }))
  t.throws(() => encrypt('hello', { iv, key: null }))
  t.throws(() => encrypt('hello', { iv, key: [] }))
  t.throws(() => encrypt(Buffer.from(0), { iv, key }))

  t.true('object' === typeof encrypt('hello', { iv, key }))
  t.true('object' === typeof encrypt(Buffer.from('hello'), { iv, key }))

  const enc = encrypt(Buffer.from('hello'), { iv, key })

  t.true('object' === typeof enc)
  t.true('string' === typeof enc.id)
  t.true('string' === typeof enc.version)
  t.true('object' === typeof enc.crypto)
  t.true('object' === typeof enc.crypto.cipherparams)
  t.true('string' === typeof enc.crypto.cipherparams.iv)
  t.true('string' === typeof enc.crypto.ciphertext)
  t.true('string' === typeof enc.crypto.cipher)
  t.true('string' === typeof enc.crypto.digest)
  t.true('string' === typeof enc.crypto.mac)

<<<<<<< HEAD
  t.true(kDefaultCipher == enc.crypto.cipher)
  t.true(kDefaultDigest == enc.crypto.digest)
  t.true(0 == Buffer.compare(uint64.encode(kVersion), Buffer.from(enc.version, 'hex')))
=======
  t.true(kDefaultCipher === enc.crypto.cipher)
  t.true(kDefaultDigest === enc.crypto.digest)
  t.true(0 === Buffer.compare(uint64.encode(kVersion), Buffer.from(enc.version, 'hex')))
>>>>>>> refactor(test/*.js): Fix linter issues
})
