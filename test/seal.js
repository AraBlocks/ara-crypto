const isBuffer = require('is-buffer')
/* eslint-disable camelcase */
const {
  crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES,
  crypto_box_SEALBYTES,
} = require('sodium-universal')

const { seal, open } = require('../seal')
const { keyPair } = require('../curve25519')
const test = require('./helpers/runner')

test.cb('seal(message, opts) is a function', (t) => {
  t.true('function' === typeof seal)
  t.end()
})

test.cb('seal(message, opts) throws on bad input', (t) => {
  t.throws(() => seal(), { instanceOf: TypeError })
  t.throws(() => seal(null, null), { instanceOf: TypeError })
  t.throws(() => seal(Buffer.alloc(0), null), { instanceOf: TypeError })
  t.throws(() => seal(Buffer.from('hello'), null), { instanceOf: TypeError })
  t.throws(() => seal(Buffer.from('hello'), {}), { instanceOf: TypeError })
  t.throws(() => seal(Buffer.from('hello'), { publicKey: null }), { instanceOf: TypeError })
  t.throws(() => seal(
    Buffer.from('hello'),
    { publicKey: Buffer.alloc(crypto_box_PUBLICKEYBYTES - 1) }
  ), { instanceOf: TypeError })

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

  t.throws(() => open(), { instanceOf: TypeError })
  t.throws(() => open(null, null), { instanceOf: TypeError })
  t.throws(() => open(sealed), { instanceOf: TypeError })
  t.throws(() => open(sealed, null), { instanceOf: TypeError })
  t.throws(() => open(sealed, {}), { instanceOf: TypeError })
  t.throws(() => open(sealed, { publicKey }), { instanceOf: TypeError })
  t.throws(() => open(Buffer.alloc(0), null), { instanceOf: TypeError })
  t.throws(() => open(sealed.slice(0, -1), {}), { instanceOf: TypeError })

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey: Buffer.alloc(0)
  }), { instanceOf: TypeError })

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey: null,
  }), { instanceOf: TypeError })

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey,
    secretKey: Buffer.alloc(0)
  }), { instanceOf: TypeError })

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey,
    secretKey: Buffer.alloc(crypto_box_SECRETKEYBYTES)
  }), { instanceOf: TypeError })

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey: Buffer.alloc(crypto_box_PUBLICKEYBYTES),
    secretKey: Buffer.alloc(crypto_box_SECRETKEYBYTES)
  }), { instanceOf: TypeError })

  t.throws(() => open(Buffer.alloc(crypto_box_SEALBYTES), {
    publicKey,
    secretKey: Buffer.alloc(crypto_box_SECRETKEYBYTES - 1)
  }), { instanceOf: TypeError })

  t.throws(() => open(sealed, {
    publicKey: publicKey.slice(0, -1),
    secretKey,
  }), { instanceOf: TypeError })

  t.throws(() => open(sealed, {
    publicKey,
    secretKey: secretKey.slice(0, -1)
  }), { instanceOf: TypeError })

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
