const { randomBytes } = require('../random-bytes')
const { decrypt } = require('../decrypt')
const { encrypt } = require('../encrypt')
const isBuffer = require('is-buffer')
const test = require('ava')

test('decrypt(value, opts)', async (t) => {
  const iv = randomBytes(16)
  const key = Buffer.alloc(16).fill('key')
  const msg = Buffer.from('hello')

  t.throws(() => decrypt(0, 0), TypeError)
  t.throws(() => decrypt(null, 0), TypeError)
  t.throws(() => decrypt(true, 0), TypeError)
  t.throws(() => decrypt('', 0), TypeError)
  t.throws(() => decrypt(Buffer.alloc(0), 0), TypeError)

  let enc = encrypt(msg, { key, iv })

  t.throws(() => decrypt(enc, null), TypeError)
  t.throws(() => decrypt(enc, {}), TypeError)
  t.throws(() => decrypt(enc, NaN), TypeError)
  t.throws(() => decrypt(enc, true), TypeError)
  t.throws(() => decrypt({}, { key, iv }), TypeError)

  enc = encrypt(msg, { key, iv })
  delete enc.crypto.cipherparams.iv
  t.throws(() => decrypt(enc, { key, iv: null }), TypeError)

  enc = encrypt(msg, { key, iv })
  enc.version = '999'
  t.throws(() => decrypt(enc, { strict: true, key, iv }), TypeError)

  enc = encrypt(msg, { key, iv })
  t.throws(() => decrypt(enc, { key, iv, cipher: 123 }), TypeError)
  t.throws(() => decrypt(enc, { key, iv, digest: 456 }), TypeError)

  enc = encrypt(msg, { key, iv })
  enc.id = null
  t.throws(() => decrypt(enc, { key, iv }), TypeError)

  enc = encrypt(msg, { key, iv })
  enc.crypto = null
  t.throws(() => decrypt(enc, { key: null, iv }), TypeError)

  enc = encrypt(msg, { key, iv })
  t.throws(() => decrypt(enc, { key: 123, iv }), TypeError)

  enc = encrypt(msg, { key, iv })
  delete enc.crypto.cipherparams.iv
  t.throws(() => decrypt(enc, { key, iv: 123 }), TypeError)

  enc = encrypt(msg, { key, iv })
  delete enc.crypto.mac
  t.throws(() => decrypt(enc, { key, iv }), TypeError)

  enc = encrypt(msg, { key, iv })
  const dec = decrypt(enc, { key })
  t.true(isBuffer(dec))
  t.true(dec.length > 0)
  t.true(dec.length === msg.length)
  t.true(0 === Buffer.compare(dec, msg))
})
