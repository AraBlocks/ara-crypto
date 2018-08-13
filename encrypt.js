const { deprecate } = require('util')
const storage = require('ara-secret-storage/encrypt')

module.exports = {
  encrypt: deprecate(
    storage.encrypt,
    'ara-crypto: crypto.encrypt() is deprecated. ' +
    'Please use \'ara-secret-storage\' instead.'
  )
}
