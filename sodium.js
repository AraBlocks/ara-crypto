/* eslint-disable camelcase */
const javascript = require('sodium-javascript')
const universal = require('sodium-universal')
const browser = require('sodium-browserify')

const nacl = {
  // eslint-disable-next-line global-require
  auth: require('tweetnacl-auth')
}

const polyfill = {
  // auth
  crypto_auth_KEYBYTES: 32,
  crypto_auth_BYTES: 32,
  crypto_auth_verify,
  crypto_auth,

  // box
  crypto_box_PUBLICKEYBYTES: 32,
  crypto_box_SECRETKEYBYTES: 32,
  crypto_box_SEALBYTES: 32,

  // secretbox
  crypto_secretbox_NONCEBYTES: 24,
  crypto_secretbox_KEYBYTES: 32,
  crypto_secretbox_MACBYTES: 16,

  // curve25519
  crypto_sign_PUBLICKEYBYTES: 32,
  crypto_sign_SECRETKEYBYTES: 64,
  crypto_sign_SEEDBYTES: 32,
  crypto_sign_BYTES: 64,

  // scalarmult
  crypto_scalarmult_SCALARBYTES: 32,
  crypto_scalarmult_BYTES: 32,

  // kx
  crypto_kx_SESSIONKEYBYTES: 32,
  crypto_kx_PUBLICKEYBYTES: 32,
  crypto_kx_SECRETKEYBYTES: 32,
  crypto_kx_SEEDBYTES: 32,

  // shorthash
  crypto_shorthash_KEYBYTES: 16,
  crypto_shorthash_BYTES: 8,
}

// const sodium = Object.assign({}, browser, javascript)
// const sodium = Object.assign({}, browser, javascript, polyfill)
const sodium = Object.assign({}, browser, javascript, polyfill, universal)

module.exports = sodium

function crypto_auth(out, message, key) {
  return Buffer.from(nacl.auth(message, key)).copy(out)
}

function crypto_auth_verify(mac, message, key) {
  const expected = Buffer.allocUnsafe(sodium.crypto_auth_BYTES)
  crypto_auth(expected, message, key)
  return 0 === Buffer.compare(expected, mac.slice(0, expected.length))
}
