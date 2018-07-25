const test = require('ava')
const sss = require('../sss')

const ZERO = Buffer.alloc(16)
ZERO.fill(0)

test('sss.isSecret(secret) is a function', (t) => {
  t.true('function' === typeof sss.isSecret)
})

test('sss.init(opts) is a function', (t) => {
  t.true('function' === typeof sss.init)
})

test('sss.secret(value, opts) is a function', (t) => {
  t.true('function' === typeof sss.secret)
})

test('sss.shares(secret, opts) is a function', (t) => {
  t.true('function' === typeof sss.shares)
})

test('sss.recover(shares, opts) is a function', (t) => {
  t.true('function' === typeof sss.recover)
})

test('sss.init(opts) throws on bad input', (t) => {
  t.throws(() => sss.init(() => {}), TypeError)
  t.throws(() => sss.init(true), TypeError)
  t.throws(() => sss.init(123), TypeError)
  t.throws(() => sss.init(''), TypeError)
})

test('sss.secret(opts) throws on bad input', (t) => {
  t.throws(() => sss.secret(undefined), TypeError)
  t.throws(() => sss.secret(null), TypeError)
  t.throws(() => sss.secret({}), TypeError)
  t.throws(() => sss.secret([]), TypeError)
  t.throws(() => sss.secret(() => {}), TypeError)
  t.throws(() => sss.secret(true), TypeError)
  t.throws(() => sss.secret(123), TypeError)
  t.throws(() => sss.secret(''), TypeError)
  t.throws(() => sss.secret(Buffer.alloc(0)), TypeError)
  t.throws(() => sss.secret(ZERO), TypeError)

  t.throws(() => sss.secret('secret', null), TypeError)
  t.throws(() => sss.secret('secret', true), TypeError)
  t.throws(() => sss.secret('secret', 123), TypeError)
  t.throws(() => sss.secret('secret', ''), TypeError)
  t.throws(() => sss.secret('secret', () => {}), TypeError)
})

test('sss.shares(opts) throws on bad input', (t) => {
  t.throws(() => sss.shares(() => {}), TypeError)
  t.throws(() => sss.shares(true), TypeError)
  t.throws(() => sss.shares(123), TypeError)
  t.throws(() => sss.shares(''), TypeError)
})

test('sss.recover(opts) throws on bad input', (t) => {
  t.throws(() => sss.recover(() => {}), TypeError)
  t.throws(() => sss.recover(true), TypeError)
  t.throws(() => sss.recover(123), TypeError)
  t.throws(() => sss.recover(''), TypeError)
})

test('compatibility', (t) => {
  const ctx = sss.init()
  t.true('object' === typeof ctx)

  // produced by https://github.com/grempe/secrets.js
  const knownKey = Buffer.from('key')
  const knownShares = [
    '801a4a3ab36c3cdfb4544b9cbd8b73f5a7f',
    '802a63a4324f56b6f5c4eb27c39853a67cb',
    '8032158752f240ad2b21c14506e3ab1a555',
    '804321a970c058a5293e285780d77caa5c4',
    '8055c0555b4aa88200bd279dba2f04c88cb',
    '806916648dd60e837fe1cc66faeb2537640',
    '807dcb81758dd4603cd3a242bf73d04c3c5',
    '8085169c1fe708999b607f9f849cd6f49c2',
    '80976239d3e56d57936d634352f9a0188a8',
    '80ae9daeddec2d4ca4cce50e379d59eb1ba'
  ]

  t.true(0 === Buffer.compare(
    ctx.recover(knownShares).buffer,
    knownKey
  ))
})
