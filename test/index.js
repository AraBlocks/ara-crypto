const crypto = require('../')
const test = require('./helpers/runner')

test.cb('crypto.createUnboxStream', (t) => {
  t.true('function' === typeof crypto.createUnboxStream)
  t.end()
})

test.cb('crypto.createBoxStream', (t) => {
  t.true('function' === typeof crypto.createBoxStream)
  t.end()
})

test.cb('crypto.discoveryKey', (t) => {
  t.true('function' === typeof crypto.discoveryKey)
  t.end()
})

test.cb('crypto.randomBytes', (t) => {
  t.true('function' === typeof crypto.randomBytes)
  t.end()
})

test.cb('crypto.curve25519', (t) => {
  t.true('object' === typeof crypto.curve25519)
  t.end()
})

test.cb('crypto.curve25519.keyPair', (t) => {
  t.true('function' === typeof crypto.curve25519.keyPair)
  t.end()
})

test.cb('crypto.ed25519', (t) => {
  t.true('object' === typeof crypto.ed25519)
  t.end()
})

test.cb('crypto.ed25519.keyPair', (t) => {
  t.true('function' === typeof crypto.ed25519.keyPair)
  t.end()
})

test.cb('crypto.ed25519.sign', (t) => {
  t.true('function' === typeof crypto.ed25519.sign)
  t.end()
})

test.cb('crypto.ed25519.verify', (t) => {
  t.true('function' === typeof crypto.ed25519.verify)
  t.end()
})

test.cb('crypto.blake2b', (t) => {
  t.true('function' === typeof crypto.blake2b)
  t.end()
})

test.cb('crypto.keyPair', (t) => {
  t.true('function' === typeof crypto.keyPair)
  t.end()
})

test.cb('crypto.base58', (t) => {
  t.true('object' === typeof crypto.base58)
  t.end()
})

test.cb('crypto.base58.encode', (t) => {
  t.true('function' === typeof crypto.base58.encode)
  t.end()
})

test.cb('crypto.base58.decode', (t) => {
  t.true('function' === typeof crypto.base58.decode)
  t.end()
})

test.cb('crypto.base64', (t) => {
  t.true('object' === typeof crypto.base64)
  t.end()
})

test.cb('crypto.base64.encode', (t) => {
  t.true('function' === typeof crypto.base64.encode)
  t.end()
})

test.cb('crypto.base64.decode', (t) => {
  t.true('function' === typeof crypto.base64.decode)
  t.end()
})

test.cb('crypto.uint64', (t) => {
  t.true('object' === typeof crypto.uint64)
  t.end()
})

test.cb('crypto.uint64.encode', (t) => {
  t.true('function' === typeof crypto.uint64.encode)
  t.end()
})

test.cb('crypto.uint64.decode', (t) => {
  t.true('function' === typeof crypto.uint64.decode)
  t.end()
})

test.cb('crypto.verify', (t) => {
  t.true('function' === typeof crypto.verify)
  t.end()
})

test.cb('crypto.unbox', (t) => {
  t.true('function' === typeof crypto.unbox)
  t.end()
})

test.cb('crypto.auth', (t) => {
  t.true('function' === typeof crypto.auth)
  t.end()
})

test.cb('crypto.auth.verify', (t) => {
  t.true('function' === typeof crypto.auth.verify)
  t.end()
})

test.cb('crypto.sign', (t) => {
  t.true('function' === typeof crypto.sign)
  t.end()
})

test.cb('crypto.box', (t) => {
  t.true('function' === typeof crypto.box)
  t.end()
})

test.cb('crypto.kx', (t) => {
  t.true('object' === typeof crypto.kx)
  t.end()
})

test.cb('crypto.kx.keyPair', (t) => {
  t.true('function' === typeof crypto.kx.keyPair)
  t.end()
})

test.cb('crypto.kx.client', (t) => {
  t.true('function' === typeof crypto.kx.client)
  t.end()
})

test.cb('crypto.kx.server', (t) => {
  t.true('function' === typeof crypto.kx.server)
  t.end()
})

test.cb('crypto.seal', (t) => {
  t.true('function' === typeof crypto.seal)
  t.end()
})

test.cb('crypto.seal.open', (t) => {
  t.true('function' === typeof crypto.seal.open)
  t.end()
})

test.cb('crypto.shash', (t) => {
  t.true('function' === typeof crypto.shash)
  t.end()
})
