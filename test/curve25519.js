const isBuffer = require('is-buffer')

const { keyPair, shared } = require('../curve25519')
const test = require('./helpers/runner')

test.cb('curve25519.keyPair(seed)', (t) => {
  t.throws(() => keyPair(null), { instanceOf: TypeError })
  t.throws(() => keyPair(0), { instanceOf: TypeError })
  t.throws(() => keyPair(''), { instanceOf: TypeError })
  t.throws(() => keyPair(true), { instanceOf: TypeError })
  t.throws(() => keyPair([]), { instanceOf: TypeError })
  t.throws(() => keyPair(Buffer.alloc(0)), { instanceOf: TypeError })
  t.throws(() => keyPair(Buffer.alloc(4)), { instanceOf: TypeError })
  t.throws(() => keyPair(Buffer.alloc(64)), { instanceOf: TypeError })

  t.true('object' === typeof keyPair())
  t.true('object' === typeof keyPair(Buffer.alloc(32).fill('hello')))
  t.true(isBuffer(keyPair().publicKey))
  t.true(isBuffer(keyPair().secretKey))
  t.true(32 === keyPair().publicKey.length)
  t.true(32 === keyPair().secretKey.length)

  t.end()
})

test.cb('curve25519.shared(secretKey, publicKey)', (t) => {
  t.throws(() => shared(), { instanceOf: TypeError })
  t.throws(() => shared(0, 0), { instanceOf: TypeError })
  t.throws(() => shared('', ''), { instanceOf: TypeError })
  t.throws(() => shared(null, null), { instanceOf: TypeError })
  t.throws(() => shared(null, Buffer.alloc(32)), { instanceOf: TypeError })
  t.throws(() => shared(Buffer.alloc(32), null), { instanceOf: TypeError })
  t.throws(() => shared(Buffer.alloc(0), Buffer.alloc(0)), { instanceOf: RangeError })
  t.throws(() => shared(Buffer.alloc(32), Buffer.alloc(0)), { instanceOf: RangeError })
  t.throws(() => shared(Buffer.alloc(0), Buffer.alloc(32)), { instanceOf: RangeError })

  const alice = keyPair()
  const bob = keyPair()
  const key = shared(alice.secretKey, bob.publicKey)

  t.true(isBuffer(key))
  t.true(32 === key.length)

  t.end()
})
