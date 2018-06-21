/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */

const { version } = require('./package')

const versions = version.split('.').map(v => parseInt(v, 10))
const [
  kVersionMajor,
  kVersionMinor,
  kVersionPatch,
] = versions

const kVersion = versions[0] << 16 | versions[1] << 8 | versions[2]

// blake2b()
const kDefaultBlake2bSize = 32

// encryption/decryption
const kDefaultCipher = 'aes-128-ctr'
const kDefaultDigest = 'sha1'

// discoveryKey
const kDefaultDiscoveryKeySize = 32

// uint64
const kMinUInt64Size = 8
const kDefaultUInt64Size = kMinUInt64Size

module.exports = {
  kDefaultDiscoveryKeySize,
  kDefaultBlake2bSize,
  kDefaultUInt64Size,
  kDefaultCipher,
  kDefaultDigest,

  kMinUInt64Size,

  kVersionMajor,
  kVersionMinor,
  kVersionPatch,
  kVersion,
}
