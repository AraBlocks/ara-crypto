const isBuffer = require('is-buffer')
const uint64 = require('../uint64')
const test = require('ava')

test('uint64.encode(value)', async (t) => {
  t.throws(() => uint64.encode(), TypeError)
  t.throws(() => uint64.encode(null), TypeError)
  t.throws(() => uint64.encode([]), TypeError)
  t.throws(() => uint64.encode({}), TypeError)
  t.throws(() => uint64.encode(true), TypeError)
  t.throws(() => uint64.encode(NaN), TypeError)
  t.throws(() => uint64.encode(() => {}), TypeError)
  t.true(isBuffer(uint64.encode(42)))
  t.true(16 === uint64.encode(42, 16).length)
})

test('uint64.decode(buffer)', async (t) => {
  const number = 84
  const buffer = uint64.encode(number)
  t.throws(() => uint64.decode(), TypeError)
  t.throws(() => uint64.decode(null), TypeError)
  t.throws(() => uint64.decode([]), TypeError)
  t.throws(() => uint64.decode({}), TypeError)
  t.throws(() => uint64.decode(true), TypeError)
  t.throws(() => uint64.decode(NaN), TypeError)
  t.throws(() => uint64.decode(() => {}), TypeError)
  t.true('number' === typeof uint64.decode(buffer))
  t.true(number === uint64.decode(buffer))
})
