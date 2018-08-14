const { sign } = require('../sign')
const ed25519 = require('../ed25519')
const test = require('./helpers/runner')

test.cb('sign()', (t) => {
  t.true('function' === typeof sign)
  t.true(sign === ed25519.sign)
  t.end()
})
