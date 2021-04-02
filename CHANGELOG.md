## [0.9.1](https://github.com/AraBlocks/ara-crypto/compare/0.9.0...0.9.1) (2021-04-02)


### Bug Fixes

* **kdf.js:** truncate key to exact bytes needed ([e502c6b](https://github.com/AraBlocks/ara-crypto/commit/e502c6befd4ed4bd8a3505c22feff351f3d3e833))



# [0.9.0](https://github.com/AraBlocks/ara-crypto/compare/0.8.5...0.9.0) (2021-04-01)



## [0.8.5](https://github.com/AraBlocks/ara-crypto/compare/0.8.4...0.8.5) (2019-04-05)



## [0.8.4](https://github.com/AraBlocks/ara-crypto/compare/0.8.3...0.8.4) (2019-03-27)


### Bug Fixes

* **package.json:** Lock in sodium-browserify@1.2.6 ([b389138](https://github.com/AraBlocks/ara-crypto/commit/b389138b345e26679f11f6606b2db6ff0e51345c))



## [0.8.3](https://github.com/AraBlocks/ara-crypto/compare/0.8.1...0.8.3) (2019-03-27)


### Bug Fixes

* **kdf:** Remove key length constraint. ([2f3103f](https://github.com/AraBlocks/ara-crypto/commit/2f3103f58cd9cf905e620511a865e3aab6fc263a))



## [0.8.1](https://github.com/AraBlocks/ara-crypto/compare/0.8.0...0.8.1) (2018-11-09)



# [0.8.0](https://github.com/AraBlocks/ara-crypto/compare/0.7.1...0.8.0) (2018-11-09)


### Bug Fixes

* **kdf:** Alloc context buffer in init instead of allocUnsafe ([7c6d261](https://github.com/AraBlocks/ara-crypto/commit/7c6d2612fbcec7a380e9366bd20d3a6ce6dd9d51))
* **kdf:** Make buffer optional for 'init' and 'derive'. ([99d46f1](https://github.com/AraBlocks/ara-crypto/commit/99d46f1f4ea7ba4e20204aa06887b96b740478ae))
* **kdf:** Remove unused constants crypto_kdf_BYTES_M* ([b485c9c](https://github.com/AraBlocks/ara-crypto/commit/b485c9c183e231d540a4fa708381686a3d9738df))
* **kdf.js:** Destructure value in ctx object. ([8dffd65](https://github.com/AraBlocks/ara-crypto/commit/8dffd65422da463cce38cdd5208891d8b61ed5d2))
* **kdf.js:** Fix eslint formatting ([a912996](https://github.com/AraBlocks/ara-crypto/commit/a9129967c569471febf0cb0c3ca9d2d883a1ebd1))
* **kdf.js:** Update at i + 1 ([fe92c45](https://github.com/AraBlocks/ara-crypto/commit/fe92c450ed3ae67bf7ec1ec9905349b9b9f2ef00))


### Features

* **kdf.js:** Introduce key derivation functions ([b7d8bf0](https://github.com/AraBlocks/ara-crypto/commit/b7d8bf03dc5ec2c302930f017778ff397e0e8f92))



## [0.7.1](https://github.com/AraBlocks/ara-crypto/compare/0.7.0...0.7.1) (2018-10-17)



# [0.7.0](https://github.com/AraBlocks/ara-crypto/compare/0.6.0...0.7.0) (2018-08-14)


### Features

* **test/helpers:** Introduce test runner and browser index ([d1a95b6](https://github.com/AraBlocks/ara-crypto/commit/d1a95b6043c584631f911f7bebbf288708ad2690))



# [0.6.0](https://github.com/AraBlocks/ara-crypto/compare/0.5.1...0.6.0) (2018-08-14)



## [0.5.1](https://github.com/AraBlocks/ara-crypto/compare/0.5.0...0.5.1) (2018-08-09)



# [0.5.0](https://github.com/AraBlocks/ara-crypto/compare/0.4.2...0.5.0) (2018-08-06)



## [0.4.2](https://github.com/AraBlocks/ara-crypto/compare/0.4.1...0.4.2) (2018-08-01)


### Features

* **shash.js:** Introduce short hash ([b8bc6f1](https://github.com/AraBlocks/ara-crypto/commit/b8bc6f10fab38ef2ae77e970d63b5f5ac0e03938))



## [0.4.1](https://github.com/AraBlocks/ara-crypto/compare/0.4.0...0.4.1) (2018-07-31)


### Features

* **curve25519.js:** Introduce shared keys (scalar multiplcation) ([8497317](https://github.com/AraBlocks/ara-crypto/commit/84973176e35d269c08ef360f2cf895717edf0d5d))



# [0.4.0](https://github.com/AraBlocks/ara-crypto/compare/0.3.2...0.4.0) (2018-07-30)


### Features

* **auth.js:** Introduce message authentication code API ([1c1d197](https://github.com/AraBlocks/ara-crypto/commit/1c1d1976d193929eac01cc148db6258a6b028708))
* **box.js:** Introduce box encryption ([f4dae43](https://github.com/AraBlocks/ara-crypto/commit/f4dae4339872ec512a9546d6c76f6accab3413fd))
* **ed25519.js:** Move ed25519 keyPair/sign/auth functions to scoped module ([8a86697](https://github.com/AraBlocks/ara-crypto/commit/8a8669718f7b34a48c674c6f9776262ebcdae468))
* **kx.js:** Introduce key exchange API ([fffafe6](https://github.com/AraBlocks/ara-crypto/commit/fffafe6bfd738271b9954c1f8e93fb3e9515ec43))
* **seal.js:** Introduce sealed box API ([13e2219](https://github.com/AraBlocks/ara-crypto/commit/13e2219cc0e264b75ecd857bda8fc2210ea5b02c))
* **unbox.js:** Introduce box decryption ([c31cd7b](https://github.com/AraBlocks/ara-crypto/commit/c31cd7b3d8e10cb85d7be07dba6206e3a59207aa))



## [0.3.2](https://github.com/AraBlocks/ara-crypto/compare/0.3.1...0.3.2) (2018-06-19)


### Features

* **curve25519.js:** Introduce Curve25519 key pairs ([5d0e731](https://github.com/AraBlocks/ara-crypto/commit/5d0e73175b53d86edaf53ea5ba36b8c8eef8cc54))



## [0.3.1](https://github.com/AraBlocks/ara-crypto/compare/0.3.0...0.3.1) (2018-05-30)



# [0.3.0](https://github.com/AraBlocks/ara-crypto/compare/0.2.4...0.3.0) (2018-05-30)


### Features

* **base58.js:** Introduce simple base58 wrapper ([a21649b](https://github.com/AraBlocks/ara-crypto/commit/a21649bcc85937230a688b3232d4d8cd48937058))
* **base64.js:** Introduce simple base64 wrapper ([ab5d54d](https://github.com/AraBlocks/ara-crypto/commit/ab5d54d47b84382253bc562665ad0cfee4a52115))



## [0.2.4](https://github.com/AraBlocks/ara-crypto/compare/0.2.3...0.2.4) (2018-05-27)



## [0.2.3](https://github.com/AraBlocks/ara-crypto/compare/0.2.2...0.2.3) (2018-05-24)



## [0.2.2](https://github.com/AraBlocks/ara-crypto/compare/0.2.1...0.2.2) (2018-05-22)



## [0.2.1](https://github.com/AraBlocks/ara-crypto/compare/0.2.0...0.2.1) (2018-05-22)


### Features

* **{encrypt,decrypt}.js:** Introduce encryption/decryption functions ([3fc4ffb](https://github.com/AraBlocks/ara-crypto/commit/3fc4ffb00bcd8a7d17dee992d79d112c66345cab))
* **constants.js:** Add constants module ([2eeb243](https://github.com/AraBlocks/ara-crypto/commit/2eeb243472496984c55919c1b3f53a186321c3a9))



# [0.2.0](https://github.com/AraBlocks/ara-crypto/compare/0.1.0...0.2.0) (2018-05-19)



# [0.1.0](https://github.com/AraBlocks/ara-crypto/compare/1659ef791abf177070ba484941fb1d9627467f83...0.1.0) (2018-05-18)


### Features

* **.:** Initial implementation ([1659ef7](https://github.com/AraBlocks/ara-crypto/commit/1659ef791abf177070ba484941fb1d9627467f83))



