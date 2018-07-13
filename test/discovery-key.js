const { discoveryKey } = require('../discovery-key')
const isBuffer = require('is-buffer')
const test = require('ava')

test('discoveryKey(buffer, size, key)', async (t) => {
  t.throws(() => discoveryKey(0, 0), TypeError)
  t.throws(() => discoveryKey(Buffer.alloc(0), 0), TypeError)
  t.throws(() => discoveryKey(Buffer.from('message'), 0), TypeError)
  t.throws(() => discoveryKey(Buffer.from('message'), -1), TypeError)
  t.true(isBuffer(discoveryKey(Buffer.from('message'))))
  t.true(isBuffer(discoveryKey(Buffer.from('message'), 16)))
  t.true(32 === discoveryKey(Buffer.from('message')).length)
  t.true(64 === discoveryKey(Buffer.from('message'), 64).length)
})
