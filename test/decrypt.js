'use strict'

const { randomBytes } = require('../random-bytes')
const { kVersion } = require('../constants')
const { decrypt } = require('../decrypt')
const { encrypt } = require('../encrypt')
const isBuffer = require('is-buffer')
const test = require('ava')

test("decrypt(value, opts)", async (t) => {
  const iv = randomBytes(16)
  const key = Buffer.alloc(16).fill('key')
  const msg = Buffer.from('hello')

  t.throws(() => decrypt(0, 0), TypeError)
  t.throws(() => decrypt(null, 0), TypeError)
  t.throws(() => decrypt(true, 0), TypeError)
  t.throws(() => decrypt('', 0), TypeError)
  t.throws(() => decrypt(Buffer.alloc(0), 0), TypeError)

  const enc = encrypt(msg, {key, iv})

  t.throws(() => decrypt(enc, null), TypeError)
  t.throws(() => decrypt(enc, {}), TypeError)
  t.throws(() => decrypt(enc, NaN), TypeError)
  t.throws(() => decrypt(enc, true), TypeError)
  t.throws(() => decrypt(enc, {key}), TypeError)
  t.throws(() => decrypt(enc, {key}), TypeError)
  t.throws(() => decrypt({}, {key, iv}), TypeError)

  const dec = decrypt(enc, {key, iv})
  t.true(isBuffer(dec))
  t.true(dec.length > 0)
  t.true(dec.length == msg.length)
  t.true(0 == Buffer.compare(dec, msg))
})
