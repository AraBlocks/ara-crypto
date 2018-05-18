'use strict'

const { keyPair } = require('../key-pair')
const { verify } = require('../verify')
const { sign } = require('../sign')
const isBuffer = require('is-buffer')
const test = require('ava')

test("verify(message, signature, publicKey)", async (t) => {
  const { publicKey, secretKey } = keyPair()

  t.throws(() => verify(0, 0, 0), TypeError)
  t.throws(() => verify(null, 0, 0), TypeError)
  t.throws(() => verify([], 0, 0), TypeError)
  t.throws(() => verify(true, 0, 0), TypeError)
  t.throws(() => verify("", 0, 0), TypeError)
  t.throws(() => verify(Buffer.alloc(0), 0, 0), TypeError)

  const message = Buffer.from('message')

  t.throws(() => verify(message, 0, 0), TypeError)
  t.throws(() => verify(message, null, 0), TypeError)
  t.throws(() => verify(message, true, 0), TypeError)
  t.throws(() => verify(message, "", 0), TypeError)
  t.throws(() => verify(message, Buffer.alloc(0), 0), TypeError)
  t.throws(() => verify(message, Buffer.alloc(8), 0), TypeError)

  const signature = sign(message, secretKey)

  t.throws(() => verify(message, signature, 0), TypeError)
  t.throws(() => verify(message, signature, null), TypeError)
  t.throws(() => verify(message, signature, []), TypeError)
  t.throws(() => verify(message, signature, true), TypeError)
  t.throws(() => verify(message, signature, ""), TypeError)

  t.true(verify(message, signature, publicKey))
})
