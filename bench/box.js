/* eslint-disable import/no-extraneous-dependencies */
const { createBoxStream } = require('../box')
const { randomBytes } = require('../random-bytes')
const speedometer = require('speedometer')
const { format } = require('util')
const pretty = require('pretty-bytes')
const split = require('split-buffer')
const diff = require('ansi-diff')

/* eslint-disable camelcase */
const {
  crypto_secretbox_NONCEBYTES,
} = require('sodium-universal')

const key = Buffer.alloc(32)
const speed = speedometer()
const nonce = randomBytes(crypto_secretbox_NONCEBYTES)
const stream = createBoxStream({ key, nonce })
const buffer = randomBytes(1024 * 65536)
const render = diff({ width: process.stdout.columns })

stream.on('data', ondata)

if (false == process.stdin.isTTY) {
  process.stdin.pipe(stream)
} else {
  for (const chunk of split(buffer, 1024)) {
    stream.write(chunk)
  }
}

function ondata(chunk) {
  if (chunk && chunk.length) {
    const bps = speed(chunk.length)
    process.stdout.write(render.update(format('%sPS', pretty(bps))))
  }
}
