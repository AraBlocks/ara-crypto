const isBuffer = require('is-buffer')

const { randomBytes } = require('../random-bytes')
const test = require('./helpers/runner')

test.cb('randomBytes(size)', (t) => {
  t.plan(13)

  t.throws(() => randomBytes(null), { instanceOf: TypeError })
  t.throws(() => randomBytes(), { instanceOf: TypeError })
  t.throws(() => randomBytes(0), { instanceOf: TypeError })
  t.throws(() => randomBytes(-1), { instanceOf: TypeError })
  t.throws(() => randomBytes(''), { instanceOf: TypeError })
  t.throws(() => randomBytes([]), { instanceOf: TypeError })
  t.throws(() => randomBytes({}), { instanceOf: TypeError })
  t.throws(() => randomBytes(() => {}), { instanceOf: TypeError })
  t.throws(() => randomBytes(true), { instanceOf: TypeError })
  t.throws(() => randomBytes(NaN), { instanceOf: TypeError })
  t.true(16 === randomBytes(16).length)
  t.true(8 === randomBytes(8).length)
  t.true(isBuffer(randomBytes(4)))

  t.end()
})
