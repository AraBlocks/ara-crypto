const isBuffer = require('is-buffer')
const test = require('./helpers/runner')
const sss = require('../sss')

const ZERO = Buffer.alloc(16)
ZERO.fill(0)

test.cb('sss.isSecret(secret) is a function', (t) => {
  t.true('function' === typeof sss.isSecret)
  t.end()
})

test.cb('sss.init(opts) is a function', (t) => {
  t.true('function' === typeof sss.init)
  t.end()
})

test.cb('sss.secret(value, opts) is a function', (t) => {
  t.true('function' === typeof sss.secret)
  t.end()
})

test.cb('sss.shares(secret, opts) is a function', (t) => {
  t.true('function' === typeof sss.shares)
  t.end()
})

test.cb('sss.recover(shares, opts) is a function', (t) => {
  t.true('function' === typeof sss.recover)
  t.end()
})

test.cb('sss.init(opts) throws on bad input', (t) => {
  t.throws(() => sss.init(() => {}), {instanceOf: TypeError})
  t.throws(() => sss.init(true), {instanceOf: TypeError})
  t.throws(() => sss.init(123), {instanceOf: TypeError})
  t.throws(() => sss.init(''), {instanceOf: TypeError})

  t.end()
})

test.cb('sss.secret(opts) throws on bad input', (t) => {
  t.throws(() => sss.secret(undefined), {instanceOf: TypeError})
  t.throws(() => sss.secret(null), {instanceOf: TypeError})
  t.throws(() => sss.secret({}), {instanceOf: TypeError})
  t.throws(() => sss.secret([]), {instanceOf: TypeError})
  t.throws(() => sss.secret(() => {}), {instanceOf: TypeError})
  t.throws(() => sss.secret(true), {instanceOf: TypeError})
  t.throws(() => sss.secret(123), {instanceOf: TypeError})
  t.throws(() => sss.secret(''), {instanceOf: TypeError})
  t.throws(() => sss.secret(Buffer.alloc(0)), {instanceOf: TypeError})
  t.throws(() => sss.secret(ZERO), {instanceOf: TypeError})

  t.throws(() => sss.secret('secret', null), {instanceOf: TypeError})
  t.throws(() => sss.secret('secret', true), {instanceOf: TypeError})
  t.throws(() => sss.secret('secret', 123), {instanceOf: TypeError})
  t.throws(() => sss.secret('secret', ''), {instanceOf: TypeError})
  t.throws(() => sss.secret('secret', () => {}), {instanceOf: TypeError})

  t.end()
})

test.cb('sss.shares(opts) throws on bad input', (t) => {
  t.throws(() => sss.shares(() => {}), {instanceOf: TypeError})
  t.throws(() => sss.shares(true), {instanceOf: TypeError})
  t.throws(() => sss.shares(123), {instanceOf: TypeError})
  t.throws(() => sss.shares(''), {instanceOf: TypeError})

  t.end()
})

test.cb('sss.recover(opts) throws on bad input', (t) => {
  t.throws(() => sss.recover(() => {}), {instanceOf: TypeError})
  t.throws(() => sss.recover(true), {instanceOf: TypeError})
  t.throws(() => sss.recover(123), {instanceOf: TypeError})
  t.throws(() => sss.recover(''), {instanceOf: TypeError})

  t.end()
})

test.cb('sss.init(opts) simple with defaults', (t) => {
  const ctx = sss.init()

  t.true('object' === typeof ctx)
  t.true('number' === typeof ctx.bits)
  t.true('number' === typeof ctx.size)
  t.true('number' === typeof ctx.radix)
  t.true('number' === typeof ctx.maxBits)
  t.true('number' === typeof ctx.padding)
  t.true('number' === typeof ctx.maxShares)
  t.true('number' === typeof ctx.bytesPerChar)
  t.true('number' === typeof ctx.maxBytesPerChar)
  t.true('object' === typeof ctx.table)
  t.true('object' === typeof ctx.codec)
  t.true(isBuffer(ctx.entropy))

  t.end()
})

test.cb('sss.secret(value) simple', (t) => {
  const secret = sss.secret('secret key')

  t.true('object' === typeof secret)
  t.true(isBuffer(secret.buffer))

  t.end()
})

test.cb('sss.shares(secret, opts) simple', (t) => {
  const shares = sss.shares('secret key', { shares: 10, threshold: 5 })

  t.true(Array.isArray(shares))
  t.true(10 === shares.length)
  t.true(shares.every(share => isBuffer(share)))

  t.end()
})

test.cb('sss.recover(shares, opts) simple', (t) => {
  const key = Buffer.from('secret key')
  const secret = sss.secret(key)
  const shares = sss.shares(secret, { shares: 10, threshold: 5 })
  const recovered = sss.recover(shares.slice(2, 7))

  t.true(0 === Buffer.compare(key, recovered.buffer))

  t.end()
})

test.cb('simple', (t) => {
  const ctx = sss.init()
  const key = Buffer.from('key')
  const secret = ctx.secret(key)
  const shares = ctx.shares(secret, { shares: 10, threshold: 5 })
  const recovered = ctx.recover(shares)

  t.true(0 === Buffer.compare(recovered.buffer, key))

  t.end()
})

// as of 2018-07-26
test.cb('compatibility 1 (DO NOT REMOVE)', (t) => {
  const ctx = sss.init()
  t.true('object' === typeof ctx)

  // DO NOT REMOVE
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

  t.end()
})

// as of 2018-07-26
test.cb('compatibility 2 (DO NOT REMOVE)', (t) => {
  const ctx = sss.init()

  t.true('object' === typeof ctx)

  // DO NOT REMOVE
  // copied from https://github.com/grempe/secrets.js/blob/master/spec/SecretsSpec.js
  const knownKey = Buffer.from('82585c749a3db7f73009d0d6107dd650')
  const knownShares = [
    '80111001e523b02029c58aceebead70329000',
    '802eeb362b5be82beae3499f09bd7f9f19b1c',
    '803d5f7e5216d716a172ebe0af46ca81684f4',
    '804e1fa5670ee4c919ffd9f8c71f32a7bfbb0',
    '8050bd6ac05ceb3eeffcbbe251932ece37657',
    '8064bb52a3db02b1962ff879d32bc56de4455',
    '8078a5f11d20cbf8d907c1d295bbda1ee900a',
    '808808ff7fae45529eb13b1e9d78faeab435f',
    '809f3b0585740fd80830c355fa501a8057733',
    '80aeca744ec715290906c995aac371ed118c2'
  ]

  const secret = ctx.secret(ctx.codec.decode(knownKey))
  const recovered = ctx.recover(knownShares)

  t.true(0 === Buffer.compare(secret.buffer, recovered.buffer))

  t.end()
})
