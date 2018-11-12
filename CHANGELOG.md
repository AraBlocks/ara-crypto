<a name="0.8.2"></a>
## [0.8.2](https://github.com/AraBlocks/ara-crypto/compare/0.8.1...0.8.2) (2018-11-12)


### Bug Fixes

* **kdf:** Remove key length constraint. ([2f3103f](https://github.com/AraBlocks/ara-crypto/commit/2f3103f))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/AraBlocks/ara-crypto/compare/0.8.0...0.8.1) (2018-11-09)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/AraBlocks/ara-crypto/compare/0.7.1...0.8.0) (2018-11-09)


### Bug Fixes

* **kdf:** Alloc context buffer in init instead of allocUnsafe ([7c6d261](https://github.com/AraBlocks/ara-crypto/commit/7c6d261))
* **kdf:** Make buffer optional for 'init' and 'derive'. ([99d46f1](https://github.com/AraBlocks/ara-crypto/commit/99d46f1))
* **kdf:** Remove unused constants crypto_kdf_BYTES_M* ([b485c9c](https://github.com/AraBlocks/ara-crypto/commit/b485c9c))
* **kdf.js:** Destructure value in ctx object. ([8dffd65](https://github.com/AraBlocks/ara-crypto/commit/8dffd65))
* **kdf.js:** Fix eslint formatting ([a912996](https://github.com/AraBlocks/ara-crypto/commit/a912996))
* **kdf.js:** Update at i + 1 ([fe92c45](https://github.com/AraBlocks/ara-crypto/commit/fe92c45))


### Features

* **kdf.js:** Introduce key derivation functions ([b7d8bf0](https://github.com/AraBlocks/ara-crypto/commit/b7d8bf0))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/AraBlocks/ara-crypto/compare/0.7.0...0.7.1) (2018-10-17)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/AraBlocks/ara-crypto/compare/0.6.0...0.7.0) (2018-08-14)


### Features

* **test/helpers:** Introduce test runner and browser index ([d1a95b6](https://github.com/AraBlocks/ara-crypto/commit/d1a95b6))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/AraBlocks/ara-crypto/compare/0.5.1...0.6.0) (2018-08-14)



<a name="0.5.1"></a>
## [0.5.1](https://github.com/AraBlocks/ara-crypto/compare/0.5.0...0.5.1) (2018-08-09)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/AraBlocks/ara-crypto/compare/0.4.2...0.5.0) (2018-08-06)



<a name="0.4.2"></a>
## [0.4.2](https://github.com/AraBlocks/ara-crypto/compare/0.4.1...0.4.2) (2018-08-01)


### Features

* **shash.js:** Introduce short hash ([b8bc6f1](https://github.com/AraBlocks/ara-crypto/commit/b8bc6f1))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/AraBlocks/ara-crypto/compare/0.4.0...0.4.1) (2018-07-31)


### Features

* **curve25519.js:** Introduce shared keys (scalar multiplcation) ([8497317](https://github.com/AraBlocks/ara-crypto/commit/8497317))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/AraBlocks/ara-crypto/compare/0.3.2...0.4.0) (2018-07-30)


### Features

* **auth.js:** Introduce message authentication code API ([1c1d197](https://github.com/AraBlocks/ara-crypto/commit/1c1d197))
* **box.js:** Introduce box encryption ([f4dae43](https://github.com/AraBlocks/ara-crypto/commit/f4dae43))
* **ed25519.js:** Move ed25519 keyPair/sign/auth functions to scoped module ([8a86697](https://github.com/AraBlocks/ara-crypto/commit/8a86697))
* **kx.js:** Introduce key exchange API ([fffafe6](https://github.com/AraBlocks/ara-crypto/commit/fffafe6))
* **seal.js:** Introduce sealed box API ([13e2219](https://github.com/AraBlocks/ara-crypto/commit/13e2219))
* **unbox.js:** Introduce box decryption ([c31cd7b](https://github.com/AraBlocks/ara-crypto/commit/c31cd7b))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/AraBlocks/ara-crypto/compare/0.3.1...0.3.2) (2018-06-19)


### Features

* **curve25519.js:** Introduce Curve25519 key pairs ([5d0e731](https://github.com/AraBlocks/ara-crypto/commit/5d0e731))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/AraBlocks/ara-crypto/compare/0.3.0...0.3.1) (2018-05-30)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/AraBlocks/ara-crypto/compare/0.2.4...0.3.0) (2018-05-30)


### Features

* **base58.js:** Introduce simple base58 wrapper ([a21649b](https://github.com/AraBlocks/ara-crypto/commit/a21649b))
* **base64.js:** Introduce simple base64 wrapper ([ab5d54d](https://github.com/AraBlocks/ara-crypto/commit/ab5d54d))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/AraBlocks/ara-crypto/compare/0.2.3...0.2.4) (2018-05-27)



<a name="0.2.3"></a>
## [0.2.3](https://github.com/AraBlocks/ara-crypto/compare/0.2.2...0.2.3) (2018-05-24)



<a name="0.2.2"></a>
## [0.2.2](https://github.com/AraBlocks/ara-crypto/compare/0.2.1...0.2.2) (2018-05-22)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/AraBlocks/ara-crypto/compare/0.2.0...0.2.1) (2018-05-22)


### Features

* **{encrypt,decrypt}.js:** Introduce encryption/decryption functions ([3fc4ffb](https://github.com/AraBlocks/ara-crypto/commit/3fc4ffb))
* **constants.js:** Add constants module ([2eeb243](https://github.com/AraBlocks/ara-crypto/commit/2eeb243))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/AraBlocks/ara-crypto/compare/0.1.0...0.2.0) (2018-05-19)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/AraBlocks/ara-crypto/compare/1659ef7...0.1.0) (2018-05-18)


### Features

* **.:** Initial implementation ([1659ef7](https://github.com/AraBlocks/ara-crypto/commit/1659ef7))



