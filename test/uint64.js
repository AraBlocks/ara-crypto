const isBuffer = require('is-buffer')
const uint64 = require('../uint64')
const test = require('./helpers/runner')

test.cb('uint64.encode(value)', (t) => {
  t.throws(() => uint64.encode(), {instanceOf: TypeError})
  t.throws(() => uint64.encode(null), {instanceOf: TypeError})
  t.throws(() => uint64.encode([]), {instanceOf: TypeError})
  t.throws(() => uint64.encode({}), {instanceOf: TypeError})
  t.throws(() => uint64.encode(true), {instanceOf: TypeError})
  t.throws(() => uint64.encode(NaN), {instanceOf: TypeError})
  t.throws(() => uint64.encode(() => {}), {instanceOf: TypeError})

  t.true(isBuffer(uint64.encode(42)))
  t.true(16 === uint64.encode(42, 16).length)

  t.end()
})

test.cb('uint64.decode(buffer)', (t) => {
  const number = 84
  const buffer = uint64.encode(number)

  t.throws(() => uint64.decode(), {instanceOf: TypeError})
  t.throws(() => uint64.decode(null), {instanceOf: TypeError})
  t.throws(() => uint64.decode([]), {instanceOf: TypeError})
  t.throws(() => uint64.decode({}), {instanceOf: TypeError})
  t.throws(() => uint64.decode(true), {instanceOf: TypeError})
  t.throws(() => uint64.decode(NaN), {instanceOf: TypeError})
  t.throws(() => uint64.decode(() => {}), {instanceOf: TypeError})

  t.true('number' === typeof uint64.decode(buffer))
  t.true(number === uint64.decode(buffer))

  t.end()
})
