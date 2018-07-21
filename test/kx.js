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
  t.throws(() => kx.keyPair(null))
  t.throws(() => kx.keyPair(1))
  t.throws(() => kx.keyPair({}))
  t.throws(() => kx.keyPair(''))
  t.throws(() => kx.keyPair(true))
  t.throws(() => kx.keyPair([]))
  t.throws(() => kx.keyPair(function() {}))
  t.throws(() => kx.keyPair(randomBytes(0)))
  t.throws(() => kx.keyPair(randomBytes(crypto_kx_SEEDBYTES + 1)))
  t.throws(() => kx.keyPair(randomBytes(crypto_kx_SEEDBYTES - 1)))
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
  t.throws(() => kx.client(function() {}), TypeError)
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
    remote: null,
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    remote: 123,
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    remote: {},
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    remote: { publicKey: null },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    remote: { publicKey: randomBytes(16) },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    remote: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1) },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    remote: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)

  t.throws(() => kx.client({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES - 1),
    remote: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)
})

test('kx.client(opts) computes session keys for client', (t) => {
  const remote = kx.keyPair()
  const { publicKey, secretKey } = kx.keyPair()
  const client = kx.client({ publicKey, secretKey, remote })
  t.true('object' === typeof client)
  t.true(isBuffer(client.receiver))
  t.true(isBuffer(client.sender))
  t.true(0 === Buffer.compare(client.rx, client.receiver))
  t.true(0 === Buffer.compare(client.tx, client.sender))
})

test('kx.remote(opts) is a function', (t) => {
  t.true('function' === typeof kx.remote)
})

test('kx.remote(opts) throws on bad input', (t) => {
  t.throws(() => kx.remote(), TypeError)
  t.throws(() => kx.remote(null), TypeError)
  t.throws(() => kx.remote(123), TypeError)
  t.throws(() => kx.remote(true), TypeError)
  t.throws(() => kx.remote(function() {}), TypeError)
  t.throws(() => kx.remote(''), TypeError)
  t.throws(() => kx.remote({}), TypeError)
  t.throws(() => kx.remote({ publicKey: null }), TypeError)
  t.throws(() => kx.remote({ publicKey: randomBytes(16) }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: null,
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: null,
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: 123,
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: {},
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: null },
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(16) },
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1) },
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES - 1),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)

  t.throws(() => kx.remote({
    publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES),
    secretKey: randomBytes(crypto_kx_SECRETKEYBYTES - 1),
    client: { publicKey: randomBytes(crypto_kx_PUBLICKEYBYTES) },
  }), TypeError)
})

test('kx.remote(opts) computes session keys for remote', (t) => {
  const client = kx.keyPair()
  const { publicKey, secretKey } = kx.keyPair()
  const remote = kx.remote({ publicKey, secretKey, client })
  t.true('object' === typeof remote)
  t.true(isBuffer(remote.receiver))
  t.true(isBuffer(remote.sender))
  t.true(0 === Buffer.compare(remote.rx, remote.receiver))
  t.true(0 === Buffer.compare(remote.tx, remote.sender))
})
