

const base64 = require('base-x')('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/')

function encode(value) {
  return base64.encode(value)
}

function decode(value) {
  return base64.decode(value)
}

module.exports = {
  encode,
  decode,
}
