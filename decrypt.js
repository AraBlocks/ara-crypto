const { deprecate } = require('util')
const storage = require('ara-secret-storage/decrypt')

module.exports = {
  decrypt: deprecate(
    storage.decrypt,
    'ara-crypto: crypto.decrypt() is deprecated. '
    + 'Please use \'ara-secret-storage\' instead.'
  )
}
