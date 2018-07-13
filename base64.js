/* eslint-disable-next-line function-paren-newline */
const alphabet = (
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
)

const base64 = require('base-x')(alphabet)

function encode(value) {
  return base64.encode(value)
}

function decode(value) {
  return base64.decode(value)
}

module.exports = {
  alphabet,
  encode,
  decode,
}
