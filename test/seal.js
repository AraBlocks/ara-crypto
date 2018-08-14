const { seal, open } = require('../seal')
const { keyPair } = require('../curve25519')
const isBuffer = require('is-buffer')
const test = require('./helpers/runner')

/* eslint-disable camelcase */
const {
  crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES,
  crypto_box_SEALBYTES,
} = require('sodium-universal')

test.cb('seal(message, opts) is a function', (t) => {
  t.true('function' === typeof seal)
  t.end()
})

test.cb('seal(message, opts) throws on bad input', (t) => {
  t.throws(() => seal(), TypeError)
  t.throws(() => seal(null, null), TypeError)
  t.throws(() => seal(Buffer.alloc(0), null), TypeError)
  t.throws(() => seal(Buffer.from('hello'), null), TypeError)
  t.throws(() => seal(Buffer.from('hello'), {}), TypeError)
  t.throws(() => seal(Buffer.from('hello'), { publicKey: null }), TypeError)
  t.throws(() => seal(
    Buffer.from('hello'),
    { publicKey: Buffer.alloc(crypto_box_PUBLICKEYBYTES - 1) }
  ), TypeError)

  t.end()
})

test.cb('seal(message, opts) seals a message', (t) => {
  const message = Buffer.from('hello')
  const { publicKey } = keyPair()
  const sealed = seal(message, { publicKey })

  t.true(isBuffer(sealed))
  t.true(sealed.length === crypto_box_SEALBYTES + message.length)

  t.end()
})

test.cb('open(message, opts) is a function', (t) => {
  t.true('function' === typeof open)
  t.true(open === seal.open)
  t.end()
})

test.cb('open(message, opts) throws on bad input', (t) => {
  const { publicKey, secretKey } = keyPair()
  const sealed = seal(Buffer.from('hello'), { publicKey })

  t.throws(() => open(), TypeError)
  t.throws(() => open(null, null), TypeError)
  t.throws(() => open(sealed), TypeError)
  t.throws(() => open(sealed, null), TypeError)
  t.throws(() => open(sealed, {}), TypeError)
  t.throws(() => open(sealed, { publicKey }), TypeError)
  t.throws(() => open(Buffer.alloc(0), null), TypeError)
  t.throws(() => open(sealed.slice(0, -1), {}), TypeError)

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey: Buffer.alloc(0)
  }), TypeError)

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey: null,
  }), TypeError)

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey,
    secretKey: Buffer.alloc(0)
  }), TypeError)

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey,
    secretKey: Buffer.alloc(crypto_box_SECRETKEYBYTES)
  }), TypeError)

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey: Buffer.alloc(crypto_box_PUBLICKEYBYTES),
    secretKey: Buffer.alloc(crypto_box_SECRETKEYBYTES)
  }), TypeError)

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey,
    secretKey: Buffer.alloc(crypto_box_SECRETKEYBYTES - 1)
  }), TypeError)

  t.throws(() => open(sealed, {
    publicKey: publicKey.slice(0, -1),
    secretKey,
  }), TypeError)

  t.throws(() => open(sealed, {
    publicKey,
    secretKey: secretKey.slice(0, -1)
  }), TypeError)

  t.end()
})

test.cb('open(message, opts) opens a sealed message', (t) => {
  const { publicKey, secretKey } = keyPair()
  const message = Buffer.from('hello')
  const sealed = seal(message, { publicKey })
  const opened = open(sealed, { publicKey, secretKey })

  t.true(0 === Buffer.compare(message, opened))

  t.end()
})
