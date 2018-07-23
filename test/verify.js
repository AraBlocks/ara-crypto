const { verify } = require('../verify')
const ed25519 = require('../ed25519')
const test = require('ava')

test('verify()', async (t) => {
  t.true('function' === typeof verify)
  t.true(verify === ed25519.verify)
})
