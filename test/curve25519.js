'use strict'

const { keyPair } = require('../curve25519')
const isBuffer = require('is-buffer')
const test = require('ava')

test("curve25519.keyPair(seed)", async (t) => {
  t.throws(() => keyPair(null), TypeError)
  t.throws(() => keyPair(0), TypeError)
  t.throws(() => keyPair(""), TypeError)
  t.throws(() => keyPair(true), TypeError)
  t.throws(() => keyPair([]), TypeError)
  t.true('object' == typeof keyPair())
  t.true('object' == typeof keyPair(Buffer.alloc(32).fill("hello")))
  t.true(isBuffer(keyPair().publicKey))
  t.true(isBuffer(keyPair().secretKey))
  t.true(32 == keyPair().publicKey.length)
  t.true(32 == keyPair().secretKey.length)
})
