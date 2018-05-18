'use strict'

const { randomBytes } = require('../random-bytes')
const isBuffer = require('is-buffer')
const test = require('ava')

test("randomBytes(size)", async (t) => {
  t.plan(13)
  t.throws(() => randomBytes(null), TypeError)
  t.throws(() => randomBytes(), TypeError)
  t.throws(() => randomBytes(0), TypeError)
  t.throws(() => randomBytes(-1), TypeError)
  t.throws(() => randomBytes(""), TypeError)
  t.throws(() => randomBytes([]), TypeError)
  t.throws(() => randomBytes({}), TypeError)
  t.throws(() => randomBytes(function () {}), TypeError)
  t.throws(() => randomBytes(true), TypeError)
  t.throws(() => randomBytes(NaN), TypeError)
  t.true(16 == randomBytes(16).length)
  t.true(8 == randomBytes(8).length)
  t.true(isBuffer(randomBytes(4)))
})
