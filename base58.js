/* eslint-disable-next-line function-paren-newline */
const alphabet = (
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
)

const base58 = require('base-x')(alphabet)

function encode(value) {
  return base58.encode(value)
}

function decode(value) {
  return base58.decode(value)
}

module.exports = {
  alphabet,
  encode,
  decode,
}
