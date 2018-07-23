<img src="https://github.com/AraBlocks/docs/blob/master/ara.png" width="30" height="30" /> ara-crypto
==========

[![Build Status](https://travis-ci.com/AraBlocks/ara-crypto.svg?token=r6p7pesHZ9MRJsVsrYFe&branch=master)](https://travis-ci.com/AraBlocks/ara-crypto)

Cryptographic functions used in ARA modules for Node.js.

## Status

This project is in active development.

## Stability

> [Stability][stability-index]: 1 - Experimental. This feature is still under
> active development and subject to non-backwards compatible changes, or even
> removal, in any future version. Use of the feature is not recommended
> in production environments. Experimental features are not subject to
> the Node.js Semantic Versioning model.

## Installation

```sh
$ npm install ara-crypto
```

## Usage

```js
const crypto = require('ara-crypto')

const message = Buffer.from('message')
const bytes = crypto.randomBytes(32)
const hash = crypto.blake2b(Buffer.from("message"))
const { publicKey, secretKey } = crypto.keyPair()
const signature = crypto.sign(message, secretKey)
const verified = crypto.verify(signature, message, publicKey)
const buffer = crypto.uint64.encode(80)
const number = crypto.uint64.decode(buffer) // 80
```

## API

Most of the functions exported by this module will check for input
correctness. If given incorrect input, a function will throw a
`TypeError` with a message describing the error. In most functions,
inputs should always be a [`Buffer`](https://nodejs.org/api/buffer.html).

* [crypto.randomBytes(size)](#randomBytes)
* [crypto.blake2b(data)](#blake2b)
* [crypto.discoveryKey(\[seed\]\[, size\]\[, key\])](#discoveryKey)
* [crypto.keyPair(\[seed\])](#keyPair)
* [crypto.sign(message, secretKey)](#sign)
* [crypto.verify(signature, message, secretKey)](#verify)
* [crypto.curve25519.keyPair(\[seed\])](#curve25519-keyPair)
* [crypto.ed25519.keyPair(\[seed\])](#ed25519-keyPair)
* [crypto.ed25519.sign(message, secretKey)](#ed25519-sign)
* [crypto.ed25519.verify(signature, message, secretKey)](#ed25519-verify)
* [crypto.uint64.encode(number)](#uint64-encode)
* [crypto.uint64.decode(buffer)](#uint64-decode)
* [crypto.encrypt(buffer, opts)](#encrypt)
* [crypto.decrypt(encrypted, opts)](#decrypt)
* [crypto.box(buffer, opts)](#box)
* [crypto.unbox(buffer, opts)](#unbox)
* [crypto.createBoxStream(opts)](#createBoxStream)
* [crypto.createUnboxStream(opts)](#createUnboxStream)
* [crypto.auth(message, key)](#auth)
* [crypto.auth.verify(mac, message, key)](#auth-verify)
* [crypto.kx.keyPair(\[seed\])](#kx-keyPair)
* [crypto.kx.client(opts)](#kx-client)
* [crypto.kx.server(opts)](#kx-server)
* [crypto.seal(message, opts)](#seal)
* [crypto.seal.open(message, opts)](#seal-open)

### `crypto.randomBytes(size)` <a name="randomBytes"></a>

> **Stability: 2** - Stable

Generate a buffer of random bytes where `size` is an unsigned integer
greater than `0`. This function will throw a `TypeError` if given
incorrect input. This function calls `sodium.randombytes_buf`
internally.

```js
const bytes = crypto.randomBytes(32)
```

### `crypto.blake2b(buffer[, size])` <a name="blake2b"></a>

> **Stability: 2** - Stable

Generates a blake2b digest hash from input of a
given size defaulting to 32 bytes. This function calls
`crypto_generichash_batch` internally.

```js
const hash = crypto.blake2b(Buffer.from("message"))
```

### `crypto.discoveryKey([seed][, size][, key])` <a name="discoveryKey"></a>

> **Stability: 2** - Stable

Generate a discovery key useful for network
keys. This function calls `crypto_generichash` internally.

```js
const { publicKey, secretKey } = crypto.keyPair()
const discoveryKey = crypto.discoveryKey(publicKey)
```

### `crypto.keyPair([seed])` <a name="keyPair"></a>

An alias for [crypto.ed25519.keyPair](#ed25519-keyPair).

### `crypto.sign(message, secretKey)` <a name="sign"></a>

An alias for [crypto.ed25519.sign](#ed25519-sign).

### `crypto.verify(signature, message, publicKey)` <a name="verify"></a>

An alias for [crypto.ed25519.verify](#ed25519-verify).

### `crypto.curve25519.keyPair([seed])` <a name="curve25519-keyPair"></a>

> **Stability: 2** - Stable

Generate a Curve25519 public and secret key pair from an optional
seed buffer. This function calls `crypto_sign_seed_keypair` and
`crypto_sign_keypair` internally and converts to Curve25519 key pair
calling `crypto_sign_ed25519_pk_to_curve25519` and
`crypto_sign_ed25519_sk_to_curve25519`.

```js
const seed = crypto.randomBytes(32)
const { publicKey, secretKey } = crypto.curve25519.keyPair(seed)
```

### `crypto.ed25519.keyPair([seed])` <a name="ed25519-keyPair"></a>

> **Stability: 2** - Stable

Generate a public and secret key pair from an optional
seed buffer. This function will throw a `TypeError` if given incorrect input.
This function calls `crypto_sign_seed_keypair` and `crypto_sign_keypair`
internally.

```js
const seed = crypto.randomBytes(32)
const { publicKey, secretKey } = crypto.keyPair(seed)
```

### `crypto.ed25519.sign(message, secretKey)` <a name="ed25519-sign"></a>

> **Stability: 2** - Stable

Sign a message buffer with a secret key buffer. This function will throw
a `TypeError` if given incorrect input. This function calls
`crypto_sign_detached` on a buffer of size `crypto_sign_BYTES`.

```js
const { publicKey, secretKey } = crypto.keyPair()
const signature = crypto.sign(Buffer.from("hello"), secretKey)
```

### `crypto.ed25519.verify(signature, message, publicKey)` <a name="ed25519-verify"></a>

> **Stability: 2** - Stable

Verify signature for a message signed with a given
public key. This function will throw a `TypeError` if given incorrect
input. This function calls `crypto_sign_verify_detached`
internally.

```js
const { publicKey, secretKey } = crypto.keyPair()
const message = Buffer.from("hello")
const signature = crypto.sign(message, secretKey)
const verified = crypto.verify(signature, message, publicKey)
if (verified) {
  // message was signed with secret key (corresponding
  // to the given public key) that generated the given signature
}
```

### `crypto.uint64.encode(value, size)` <a name="uint64-encode"></a>

> **Stability: 2** - Stable

Encode an unsigned 64-bit big endian number into a buffer
of a given size defaulting to 8 bytes.

```js
const buffer = crypto.uint64.encode(80)
```

### `crypto.uint64.decode(buffer)` <a name="uint64-decode"></a>

> **Stability: 2** - Stable

Decode an unsigned 64-bit big endian buffer into a number

```js
const buffer = crypto.uint64.encode(80)
const number = crypto.uint64.decode(buffer) // 80
```

### `crypto.encrypt(value, opts)` <a name="encrypt"></a>

> **Stability: 1** - Experimental

Encrypts value into a "crypto" object configured by
an initialization vector (iv) and secret key (key) with
optional cipher and digest algorithms.

```js
const message = Buffer.from('hello')
const key = Buffer.alloc(16).fill('key')
const iv = crypto.randomBytes(16)
const enc = crypto.encrypt(message, { key, iv })
console.log(enc)
```

Should output:

```js
{ id: 'a83f4ea0-f486-4d32-82ec-8a047bd085a7',
  version: 0,
  crypto:
    { cipherparams: { iv: 'a292924998b67cf8d1abcb5f1174e7de' },
      ciphertext: '5e46475c92',
      cipher: 'aes-128-ctr',
      digest: 'sha1',
      mac: '702deecad7b3bf12ae9bcff7cfd13ee24e43cd13' } }

```

### `crypto.decrypt(value, opts)` <a name="decrypt"></a>

> **Stability: 1** - Experimental

Decrypt an encrypted "crypto" object into the originally
encoded buffer.

```js
const message = Buffer.from('hello')
const key = Buffer.alloc(16).fill('key')
const iv = crypto.randomBytes(16)
const enc = crypto.encrypt(message, { key, iv })
const dec = crypto.decrypt(enc, { key })
assert(0 == Buffer.compare(dec, message))
```

### `crypto.box(buffer, opts)` <a name="box"></a>

> **Stability: 1** - Experimental

"Boxes", or encrypts, a buffer from a 32 byte encryption key and a 24-byte nonce.

```js
const key = Buffer.alloc(32); key.fill('SECRET!KEY')
const nonce = crypto.randomBytes(24)
const secret = Buffer.concat([ key, nonce ])
const buffer = Buffer.from('hello!')
const boxed = crypto.box(buffer, { secret }) // or crypto.box(buffer, { nonce, key })
console.log(boxed) // <Buffer 11 8f 40 2b 8a f5 10 08 1f fe 59 b9 97 9c b8 a2 89 e7 b8 78 50 75 ed d9 8e 9c 09 38 0e 81 31 ff fa c6 96 df 57 db 85 ae>

```

### `crypto.unbox(buffer, opts)` <a name="unbox"></a>

> **Stability: 1** - Experimental

"Unboxes" or decrypts a buffer from a 32-byte encryption key and a 24-byte nonce.

```js
const key = Buffer.alloc(32); key.fill('SECRET!KEY')
const nonce = crypto.randomBytes(24)
const secret = Buffer.concat([ key, nonce ])
const buffer = Buffer.from('hello!')
const boxed = crypto.box(buffer, { secret }) // or crypto.box(buffer, { nonce, key })
const unboxed = crypto.unbox(boxed, { secret }) // or crypto.unbox(boxed, { nonce, key })
console.log(unboxed) // hello!
```

### `crypto.createBoxStream(opts)` <a name="createBoxStream"></a>

> **Stability: 1** - Experimental

Creates a transform stream that "boxes" messages written to it.

```js
const key = Buffer.alloc(32); key.fill('SECRET!KEY')
const nonce = crypto.randomBytes(24)
const secret = Buffer.concat([ key, nonce ])
const buffer = Buffer.from('hello!')
const stream = crypto.createBoxStream({ secret }) // or crypto.createBoxStream({ nonce, key })
stream.on('data', (chunk) => console.log(chunk)) // cipher text
stream.write(buffer)
```

### `crypto.createUnboxStream(opts)` <a name="createUnboxStream"></a>

> **Stability: 1** - Experimental

Creates a transform stream that "unboxes" messages written to it.

```js
const key = Buffer.alloc(32); key.fill('SECRET!KEY')
const nonce = crypto.randomBytes(24)
const secret = Buffer.concat([ key, nonce ])
const buffer = Buffer.from('hello!')
const stream = crypto.createUnboxStream({ secret }) // or crypto.createUnboxStream({ nonce, key })
const boxed = crypto.box(buffer, { secret })
stream.on('data', (chunk) => console.log(chunk)) // hello!
stream.write(boxed)
```

### `crypto.auth(message, key)` <a name="auth"></a>

> **Stability: 2** - Stable

Generates and returns a message authentication code (MAC) for
a given message and secret key.

```js
const message = Buffer.from('hello')
const key = crypto.randomBytes(32)
const mac = auth(message, key)
```

`Secret + Nonce` based message authentication codes:

```js
const message = Buffer.from('hello')
const secret = getSecretFromSomeWhere()
const nonce = crypto.randomBytes(32)
const key = crypto.blake2b(Buffer.concat([secret, nonce]))
const mac = auth(message, key)
```

### `crypto.auth.verify(mac, message, key)` <a name="auth-verify"></a>

> **Stability: 2** - Stable

Verifies the authenticity of a message with a given message
authentication code (MAC) and secret key.

```js
const message = Buffer.from('hello')
const key = crypto.randomBytes(32)
const mac = auth(message, key)

if (false === verify(mac, message, key)) {
  throw new Error('Message forged!')
}
```

### `crypto.kx.keyPair([seed])` <a name="kx-keyPair"></a>

> **Stability: 2** - Stable

Generates a key exchange key pair.

```js
const seed = crypto.randomBytes(32)
const kp = crypto.kx.keyPair(seed)
```

### `crypto.kx.client(opts)` <a name="kx-client"></a>

> **Stability: 1** - Experimental

Compute sender (tx) and receiver (rx) session keys for a client
based on a server's public key.

```js
const serverPublicKey = getServerPublicKey()
const { publicKey, secretKey } = getClientKeyPair()
const client = kx.client({
  publicKey,
  secretKey,
  server: { publicKey: serverPublicKey }
})
```

### `crypto.kx.server(opts)` <a name="kx-server"></a>

> **Stability: 1** - Experimental

Compute sender (tx) and receiver (rx) session keys for a server
based on a client's public key.

```js
const clientPublicKey = getClientPublicKey()
const { publicKey, secretKey } = getServerKeyPair()
const server = kx.server({
  publicKey,
  secretKey,
  client: { publicKey: clientPublicKey }
})
```

### `crypto.seal(message, opts)` <a name="seal"></a>

> **Stability: 2** - Stable

Seals a message based on a curve25519 public key for a recipient
who has the corresponding secret key.

```js
const publicKey = getRemotePublicKey()
const message = Buffer.from('hello')
const sealed = crypto.seal(message, publicKey)
```

### `crypto.seal.open(message, opts)` <a name="seal-open"></a>

> **Stability: 2** - Stable

Opens a sealed message based on a curve25519 public key for a recipient
who has the corresponding secret key.

```js
const { publicKey, secretKey } = getKeyPair()
const message = crypto.seal.open(ciphertext, { publicKey, secretKey })
```

## Contributing

- [Commit message format](/.github/COMMIT_FORMAT.md)
- [Commit message examples](/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](/.github/CONTRIBUTING.md)

## See Also

- [libsodium](https://download.libsodium.org/doc/)
- [sodium-universal](https://github.com/sodium-friends/sodium-universal)
- [ara-identity](https://github.com/arablocks/ara-identity)
- [Stability index][stability-index]

## License

LGPL-3.0

[stability-index]: https://nodejs.org/api/documentation.html#documentation_stability_index
