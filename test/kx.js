const { randomBytes } = require('../random-bytes')
const isBuffer = require('is-buffer')
const test = require('ava')
const kx = require('../kx')

/* eslint-disable camelcase */
const {
  crypto_kx_SESSIONKEYBYTES,
  crypto_kx_PUBLICKEYBYTES,
  crypto_kx_SECRETKEYBYTES,
  crypto_kx_SEEDBYTES,
} = require('sodium-universal')

test('kx.keyPair(seed) is a function', (t) => {
  t.true('function' === typeof kx.keyPair)
})

test('kx.keyPair(seed) throws on bad input', (t) => {
  t.throws(() => kx.keyPair(null), TypeError)
  t.throws(() => kx.keyPair(1), TypeError)
  t.throws(() => kx.keyPair({}), TypeError)
  t.throws(() => kx.keyPair(''), TypeError)
  t.throws(() => kx.keyPair(true), TypeError)
  t.throws(() => kx.keyPair([]), TypeError)
  t.throws(() => kx.keyPair(() => undefined), TypeError)
  t.throws(() => kx.keyPair(randomBytes(0)), TypeError)
  t.throws(() => kx.keyPair(randomBytes(crypto_kx_SEEDBYTES + 1)), TypeError)
  t.throws(() => kx.keyPair(randomBytes(crypto_kx_SEEDBYTES - 1)), TypeError)
})

test('kx.keyPair(seed) returns a random key pair without seed', (t) => {
  const kp = kx.keyPair()
  t.true('object' === typeof kp)
  t.true(isBuffer(kp.publicKey))
  t.true(isBuffer(kp.secretKey))
  t.true(crypto_kx_PUBLICKEYBYTES === kp.publicKey.length)
  t.true(crypto_kx_SECRETKEYBYTES === kp.secretKey.length)
})

test('kx.keyPair(seed) returns a key pair from seed', (t) => {
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
})

test('kx.client(opts) is a function', (t) => {
  t.true('function' === typeof kx.client)
})

test('kx.client(opts) throws on bad input', (t) => {
  t.throws(() => kx.client(), TypeError)
  t.throws(() => kx.client(null), TypeError)
  t.throws(() => kx.client(123), TypeError)
  t.throws(() => kx.client(true), TypeError)
  t.throws(() => kx.client(() => undefined), TypeError)
  t.throws(() => kx.client(''), TypeError)
  t.throws(() => kx.client({}), TypeError)
  t.throws(() => kx.client({ publicKey: null }), TypeError)
  t.throws(() => kx.client({ publicKey: randomBytes(16) }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: null,
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: null,
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: 123,
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: {},
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: null },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: randomBytes(16) },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1) },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    server: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES - 1),
    server: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)
})

test('kx.client(opts) computes session keys for client', (t) => {
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
})

test('kx.server(opts) is a function', (t) => {
  t.true('function' === typeof kx.server)
})

test('kx.server(opts) throws on bad input', (t) => {
  t.throws(() => kx.server(), TypeError)
  t.throws(() => kx.server(null), TypeError)
  t.throws(() => kx.server(123), TypeError)
  t.throws(() => kx.server(true), TypeError)
  t.throws(() => kx.server(() => undefined), TypeError)
  t.throws(() => kx.server(''), TypeError)
  t.throws(() => kx.server({}), TypeError)
  t.throws(() => kx.server({ publicKey: null }), TypeError)
  t.throws(() => kx.server({ publicKey: randomBytes(16) }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: null,
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: null,
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: 123,
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: {},
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: null },
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(16) },
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1) },
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)

  t.throws(() => kx.server({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES - 1),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)
})

test('kx.server(opts) computes session keys for server', (t) => {
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
})
