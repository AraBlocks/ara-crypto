'use strict'

const base58 = require('base-x')(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
)

function encode(value) {
  return base58.encode(value)
}

function decode(value) {
  return base58.decode(value)
}

module.exports = {
  encode,
  decode,
}
