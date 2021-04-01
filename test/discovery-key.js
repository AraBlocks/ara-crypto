const isBuffer = require('is-buffer')
const { discoveryKey } = require('../discovery-key')
const test = require('./helpers/runner')

test.cb('discoveryKey(buffer, size, key)', (t) => {
  t.throws(() => discoveryKey(0, 0), { instanceOf: TypeError })
  t.throws(() => discoveryKey(Buffer.alloc(0), 0), { instanceOf: TypeError })
  t.throws(() => discoveryKey(Buffer.from('message'), 0), { instanceOf: TypeError })
  t.throws(() => discoveryKey(Buffer.from('message'), -1), { instanceOf: TypeError })

  t.true(isBuffer(discoveryKey(Buffer.from('message'))))
  t.true(isBuffer(discoveryKey(Buffer.from('message'), 16)))
  t.true(32 === discoveryKey(Buffer.from('message')).length)
  t.true(64 === discoveryKey(Buffer.from('message'), 64).length)

  t.end()
})
