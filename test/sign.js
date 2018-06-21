const { keyPair } = require('../key-pair')
const { sign } = require('../sign')
const isBuffer = require('is-buffer')
const test = require('ava')

test('sign(message, secretKey)', async (t) => {
  t.throws(() => sign(0, 0), TypeError)
  t.throws(() => sign(null, 0), TypeError)
  t.throws(() => sign(true, 0), TypeError)
  t.throws(() => sign([], 0), TypeError)
  t.throws(() => sign('', 0), TypeError)
  t.throws(() => sign(Buffer.from(0), 0), TypeError)

  t.throws(() => sign(Buffer.from('message'), 0), TypeError)
  t.throws(() => sign(Buffer.from('message'), null), TypeError)
  t.throws(() => sign(Buffer.from('message'), true), TypeError)
  t.throws(() => sign(Buffer.from('message'), []), TypeError)
  t.throws(() => sign(Buffer.from('message'), ''), TypeError)
  t.throws(() => sign(Buffer.from('message'), Buffer.from(0)), TypeError)

  const { secretKey } = keyPair()

  t.true(isBuffer(sign(Buffer.from('message'), secretKey)))
})
