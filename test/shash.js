const isBuffer = require('is-buffer')
/* eslint-disable camelcase */
const {
  crypto_shorthash_KEYBYTES,
  crypto_shorthash_BYTES,
} = require('sodium-universal')

const { shash } = require('../shash')
const test = require('./helpers/runner')

test.cb('shash(message, secretKey) is a function', (t) => {
  t.true('function' === typeof shash)
  t.end()
})

test.cb('shash(message, secretKey) throws on bad input', (t) => {
  t.throws(() => shash(), { instanceOf: TypeError })
  t.throws(() => shash(null, null), { instanceOf: TypeError })
  t.throws(() => shash(123, null), { instanceOf: TypeError })
  t.throws(() => shash(true, null), { instanceOf: TypeError })
  t.throws(() => shash('hello', null), { instanceOf: TypeError })
  t.throws(() => shash(Buffer.alloc(0), null), { instanceOf: TypeError })
  t.throws(() => shash(Buffer.alloc(8), null), { instanceOf: TypeError })
  t.throws(() => shash(Buffer.alloc(8), true), { instanceOf: TypeError })
  t.throws(() => shash(Buffer.alloc(8), 123), { instanceOf: TypeError })
  t.throws(() => shash(Buffer.alloc(8), 'hello'), { instanceOf: TypeError })
  t.throws(() => shash(Buffer.alloc(8), 'hello'), { instanceOf: TypeError })

  t.throws(
    () => shash(Buffer.alloc(8), Buffer.alloc(0)),
    { instanceOf: RangeError }
  )

  t.throws(() => shash(
    Buffer.alloc(8),
    Buffer.alloc(crypto_shorthash_KEYBYTES + 1)
  ), { instanceOf: RangeError })

  t.throws(() => shash(
    Buffer.alloc(0),
    Buffer.alloc(crypto_shorthash_KEYBYTES)
  ), { instanceOf: RangeError })

  t.end()
})

test.cb('shash(message, secretKey) simple', (t) => {
  const message = Buffer.from('hello')
  const key = Buffer.alloc(crypto_shorthash_KEYBYTES).fill('secret')
  const hash = shash(message, key)

  t.true(isBuffer(hash))
  t.true(crypto_shorthash_BYTES === hash.length)
  t.true(0 === Buffer.compare(hash, shash(message, key)))
  t.true(0 !== Buffer.compare(shash(hash, key), shash(message, key)))

  t.end()
})
