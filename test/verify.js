const { keyPair } = require('../key-pair')
const { verify } = require('../verify')
const { sign } = require('../sign')
const test = require('ava')

test('verify(signature, message, publicKey)', async (t) => {
  const { publicKey, secretKey } = keyPair()

  t.throws(() => verify(0, 0, 0), TypeError)
  t.throws(() => verify(null, 0, 0), TypeError)
  t.throws(() => verify([], 0, 0), TypeError)
  t.throws(() => verify(true, 0, 0), TypeError)
  t.throws(() => verify('', 0, 0), TypeError)
  t.throws(() => verify(Buffer.alloc(0), 0, 0), TypeError)

  const message = Buffer.from('message')

  t.throws(() => verify(0, message, 0, 0), TypeError)
  t.throws(() => verify(0, message, null, 0), TypeError)
  t.throws(() => verify(0, message, true, 0), TypeError)
  t.throws(() => verify(0, message, '', 0), TypeError)
  t.throws(() => verify(0, message, Buffer.alloc(0), 0), TypeError)
  t.throws(() => verify(0, message, Buffer.alloc(8), 0), TypeError)

  const signature = sign(message, secretKey)

  t.throws(() => verify(signature, message, 0), TypeError)
  t.throws(() => verify(signature, message, null), TypeError)
  t.throws(() => verify(signature, message, []), TypeError)
  t.throws(() => verify(signature, message, true), TypeError)
  t.throws(() => verify(signature, message, ''), TypeError)

  t.true(verify(signature, message, publicKey))
})
