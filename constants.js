const { version } = require('./package')

const versions = version.split('.').map(v => parseInt(v, 10))
const [
  kVersionMajor,
  kVersionMinor,
  kVersionPatch,
] = versions

/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
const kVersion = versions[0] << 16 | versions[1] << 8 | versions[2]

// encryption/decryption
const kDefaultCipher = 'aes-128-ctr'
const kDefaultDigest = 'sha1'

module.exports = {
  kDefaultCipher,
  kDefaultDigest,

  kVersionMajor,
  kVersionMinor,
  kVersionPatch,
  kVersion,
}
