const crypto = require('../')
const test = require('ava')

test('crypto.createUnboxStream', (t) => {
  t.true('function' === typeof crypto.createUnboxStream)
})

test('crypto.createBoxStream', (t) => {
  t.true('function' === typeof crypto.createBoxStream)
})

test('crypto.discoveryKey', (t) => {
  t.true('function' === typeof crypto.discoveryKey)
})

test('crypto.randomBytes', (t) => {
  t.true('function' === typeof crypto.randomBytes)
})

test('crypto.curve25519', (t) => {
  t.true('object' === typeof crypto.curve25519)
})

test('crypto.curve25519.keyPair', (t) => {
  t.true('function' === typeof crypto.curve25519.keyPair)
})

test('crypto.ed25519', (t) => {
  t.true('object' === typeof crypto.ed25519)
})

test('crypto.ed25519.keyPair', (t) => {
  t.true('function' === typeof crypto.ed25519.keyPair)
})

test('crypto.ed25519.sign', (t) => {
  t.true('function' === typeof crypto.ed25519.sign)
})

test('crypto.ed25519.verify', (t) => {
  t.true('function' === typeof crypto.ed25519.verify)
})

test('crypto.blake2b', (t) => {
  t.true('function' === typeof crypto.blake2b)
})

test('crypto.decrypt', (t) => {
  t.true('function' === typeof crypto.decrypt)
})

test('crypto.encrypt', (t) => {
  t.true('function' === typeof crypto.encrypt)
})

test('crypto.keyPair', (t) => {
  t.true('function' === typeof crypto.keyPair)
})

test('crypto.base58', (t) => {
  t.true('object' === typeof crypto.base58)
})

test('crypto.base58.encode', (t) => {
  t.true('function' === typeof crypto.base58.encode)
})

test('crypto.base58.decode', (t) => {
  t.true('function' === typeof crypto.base58.decode)
})

test('crypto.base64', (t) => {
  t.true('object' === typeof crypto.base64)
})

test('crypto.base64.encode', (t) => {
  t.true('function' === typeof crypto.base64.encode)
})

test('crypto.base64.decode', (t) => {
  t.true('function' === typeof crypto.base64.decode)
})

test('crypto.uint64', (t) => {
  t.true('object' === typeof crypto.uint64)
})

test('crypto.uint64.encode', (t) => {
  t.true('function' === typeof crypto.uint64.encode)
})

test('crypto.uint64.decode', (t) => {
  t.true('function' === typeof crypto.uint64.decode)
})

test('crypto.verify', (t) => {
  t.true('function' === typeof crypto.verify)
})

test('crypto.unbox', (t) => {
  t.true('function' === typeof crypto.unbox)
})

test('crypto.auth', (t) => {
  t.true('function' === typeof crypto.auth)
})

test('crypto.auth.verify', (t) => {
  t.true('function' === typeof crypto.auth.verify)
})

test('crypto.sign', (t) => {
  t.true('function' === typeof crypto.sign)
})

test('crypto.box', (t) => {
  t.true('function' === typeof crypto.box)
})

test('crypto.kx', (t) => {
  t.true('object' === typeof crypto.kx)
})

test('crypto.kx.keyPair', (t) => {
  t.true('function' === typeof crypto.kx.keyPair)
})

test('crypto.kx.client', (t) => {
  t.true('function' === typeof crypto.kx.client)
})

test('crypto.kx.server', (t) => {
  t.true('function' === typeof crypto.kx.server)
})

test('crypto.seal', (t) => {
  t.true('function' === typeof crypto.seal)
})

test('crypto.seal.open', (t) => {
  t.true('function' === typeof crypto.seal.open)
})
