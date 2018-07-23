const { sign } = require('../sign')
const ed25519 = require('../ed25519')
const test = require('ava')

test('sign()', async (t) => {
  t.true('function' === typeof sign)
  t.true(sign === ed25519.sign)
})
