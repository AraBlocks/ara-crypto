const isBuffer = require('is-buffer')

const { blake2b } = require('../blake2b')
const test = require('./helpers/runner')

test('blake2b(buffer, size)', async (t) => {
  t.throws(() => blake2b(0, 0), { instanceOf: TypeError })
  t.throws(() => blake2b(null), { instanceOf: TypeError })
  t.throws(() => blake2b([ null ]), { instanceOf: TypeError })
  t.throws(() => blake2b([ Buffer.alloc(0) ]), { instanceOf: TypeError })
  t.throws(() => blake2b(Buffer.alloc(0), 0), { instanceOf: TypeError })
  t.throws(() => blake2b(Buffer.from('message'), 0), { instanceOf: TypeError })
  t.throws(() => blake2b(Buffer.from('message'), -1), { instanceOf: TypeError })
  t.true(isBuffer(blake2b(Buffer.from('message'))))
  t.true(isBuffer(blake2b(Buffer.from('message'), 16)))
  t.true(32 === blake2b(Buffer.from('message')).length)
  t.true(64 === blake2b(Buffer.from('message'), 64).length)
})
