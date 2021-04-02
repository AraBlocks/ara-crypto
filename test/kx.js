const isBuffer = require('is-buffer')
/* eslint-disable camelcase */
const {
  crypto_kx_SESSIONKEYBYTES,
  crypto_kx_PUBLICKEYBYTES,
  crypto_kx_SECRETKEYBYTES,
  crypto_kx_SEEDBYTES,
} = require('sodium-universal')

const { randomBytes } = require('../random-bytes')
const test = require('./helpers/runner')
const kx = require('../kx')

test.cb('kx.keyPair(seed) is a function', (t) => {
  t.true('function' === typeof kx.keyPair)
  t.end()
})

test.cb('kx.keyPair(seed) throws on bad input', (t) => {
  t.throws(() => kx.keyPair(null), { instanceOf: TypeError })
  t.throws(() => kx.keyPair(1), { instanceOf: TypeError })
  t.throws(() => kx.keyPair({}), { instanceOf: TypeError })
  t.throws(() => kx.keyPair(''), { instanceOf: TypeError })
  t.throws(() => kx.keyPair(true), { instanceOf: TypeError })
  t.throws(() => kx.keyPair([]), { instanceOf: TypeError })
  t.throws(() => kx.keyPair(() => undefined), { instanceOf: TypeError })
  t.throws(() => kx.keyPair(randomBytes(0)), { instanceOf: TypeError })

  t.throws(
    () => kx.keyPair(randomBytes(crypto_kx_SEEDBYTES + 1)),
    { instanceOf: TypeError }
  )

  t.throws(
    () => kx.keyPair(randomBytes(crypto_kx_SEEDBYTES - 1)),
    { instanceOf: TypeError }
  )

  t.end()
})

test.cb('kx.keyPair(seed) returns a random key pair without seed', (t) => {
  const kp = kx.keyPair()

  t.true('object' === typeof kp)
  t.true(isBuffer(kp.publicKey))
  t.true(isBuffer(kp.secretKey))
  t.true(crypto_kx_PUBLICKEYBYTES === kp.publicKey.length)
  t.true(crypto_kx_SECRETKEYBYTES === kp.secretKey.length)

  t.end()
})

test.cb('kx.keyPair(seed) returns a key pair from seed', (t) => {
  const seed = randomBytes(crypto_kx_SEEDBYTES)
  const kp1 = kx.keyPair(seed)
  const kp2 = kx.keyPair(seed)

  t.true('object' === typeof kp1)
  t.true(isBuffer(kp1.publicKey))
  t.true(isBuffer(kp1.secretKey))
  t.true(crypto_kx_PUBLICKEYBYTES === kp1.publicKey.length)
  t.true(crypto_kx_SECRETKEYBYTES === kp1.secretKey.length)
  t.true(0 === Buffer.compare(kp1.publicKey, kp2.publicKey))
  t.true(0 === Buffer.compare(kp1.secretKey, kp2.secretKey))

  t.end()
})

test.cb('kx.client(opts) is a function', (t) => {
  t.true('function' === typeof kx.client)
  t.end()
})

test.cb('kx.client(opts) throws on bad input', (t) => {
  t.throws(() => kx.client(), { instanceOf: TypeError })
  t.throws(() => kx.client(null), { instanceOf: TypeError })
  t.throws(() => kx.client(123), { instanceOf: TypeError })
  t.throws(() => kx.client(true), { instanceOf: TypeError })
  t.throws(() => kx.client(() => undefined), { instanceOf: TypeError })
  t.throws(() => kx.client(''), { instanceOf: TypeError })
  t.throws(() => kx.client({}), { instanceOf: TypeError })
  t.throws(() => kx.client({ publicKey: null }), { instanceOf: TypeError })

  t.throws(
    () => kx.client({ publicKey: randomBytes(16) }),
    { instanceOf: TypeError }
  )

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: null,
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: null,
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: 123,
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: {},
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: null },
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: randomBytes(16) },
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1) },
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), { instanceOf: TypeError })

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES - 1),
    server: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), { instanceOf: TypeError })

  t.end()
})

test.cb('kx.client(opts) computes session keys for client', (t) => {
  const server = kx.keyPair()
  const { publicKey, secretKey } = kx.keyPair()
  const client = kx.client({ publicKey, secretKey, server })

  t.true('object' === typeof client)
  t.true(isBuffer(client.receiver))
  t.true(isBuffer(client.sender))
  t.true(0 === Buffer.compare(client.rx, client.receiver))
  t.true(0 === Buffer.compare(client.tx, client.sender))
  t.true(crypto_kx_SESSIONKEYBYTES === client.receiver.length)
  t.true(crypto_kx_SESSIONKEYBYTES === client.sender.length)

  t.end()
})

test.cb('kx.server(opts) is a function', (t) => {
  t.true('function' === typeof kx.server)
  t.end()
})

test.cb('kx.server(opts) throws on bad input', (t) => {
  t.throws(() => kx.server(), { instanceOf: TypeError })
  t.throws(() => kx.server(null), { instanceOf: TypeError })
  t.throws(() => kx.server(123), { instanceOf: TypeError })
  t.throws(() => kx.server(true), { instanceOf: TypeError })
  t.throws(() => kx.server(() => undefined), { instanceOf: TypeError })
  t.throws(() => kx.server(''), { instanceOf: TypeError })
  t.throws(() => kx.server({}), { instanceOf: TypeError })
  t.throws(() => kx.server({ publicKey: null }), { instanceOf: TypeError })

  t.throws(
    () => kx.server({ publicKey: randomBytes(16) }),
    { instanceOf: TypeError }
  )

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: null,
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: null,
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: 123,
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: {},
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: null },
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(16) },
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1) },
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), { instanceOf: TypeError })

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES - 1),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), { instanceOf: TypeError })

  t.end()
})

test.cb('kx.server(opts) computes session keys for server', (t) => {
  const client = kx.keyPair()
  const { publicKey, secretKey } = kx.keyPair()
  const server = kx.server({ publicKey, secretKey, client })

  t.true('object' === typeof server)
  t.true(isBuffer(server.receiver))
  t.true(isBuffer(server.sender))
  t.true(0 === Buffer.compare(server.rx, server.receiver))
  t.true(0 === Buffer.compare(server.tx, server.sender))
  t.true(crypto_kx_SESSIONKEYBYTES === server.receiver.length)
  t.true(crypto_kx_SESSIONKEYBYTES === server.sender.length)

  t.end()
})
