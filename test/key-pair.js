const { keyPair } = require('../key-pair')
const ed25519 = require('../ed25519')
const test = require('ava')

test('keyPair()', async (t) => {
  t.true('function' === typeof keyPair)
  t.true(keyPair === ed25519.keyPair)
})
