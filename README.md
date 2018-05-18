ara-crypto
==========

Cryptographic functions used in Ara modules.

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
const verified = crypto.verify(message, signature, publicKey)
const buffer = crypto.uint64.encode(80)
const number = crypto.uint64.decode(buffer) // 80
```

## API

Most of the functions exported by this module will check for input
correctness. If given incorrect input, a function will throw a
`TypeError` with a message describing the error. In most function,
inputs should always be a `Buffer`.

### `crypto.randomBytes(size)`

Generate a buffer of random bytes where `size` is an unsigned integer
greater than `0`. This function will throw a `TypeError` if given
incorrect input. This function calls `sodium.randombytes_buf`
internally.

```js
const bytes = crypto.randomBytes(32)
```

### `crypto.blake2b(buffer, size)`

Generates a blake2b digest hash from input of a
given size defaulting to 32 bytes. This function calls
`crypto_generichash_batch` internally.

```js
const hash = crypto.blake2b(Buffer.from("message"))
```

### `crypto.discoveryKey(buffer, size, key)`

Generate a discovery digest useful for network
keys. This function calls `crypto_generichash` internally.

```js
const { publicKey, secretKey } = crypto.keyPair()
const discoveryKey = crypto.discoveryKey(publicKey)
```

### `crypto.keyPair(seed)`

Generate a public and secret key pair from an optional
seed buffer. This function will throw a `TypeError` if given incorrect input.
This function calls `crypto_sign_seed_keypair` and `crypto_sign_keypair`
internally.

```js
const seed = crypto.randomBytes(32)
const { publicKey, secretKey } = crypto.keyPair(seed)
```

### `crypto.sign(message, secretKey)`

Sign a message buffer with a secret key buffer. This function will throw
a `TypeError` if given incorrect input. This function calls
`crypto_sign_detached` on a buffer of size `crypto_sign_BYTES`.

```js
const { publicKey, secretKey } = crypto.keyPair()
const signature = crypto.sign(Buffer.from("hello"), secretKey)
```

### `crypto.verify(message, signature, publicKey)`

Verify signature for a message signed with a given
public key. This function will throw a `TypeError` if given incorrect
input. This function calls `crypto_sign_verify_detached`
internally.

```js
const { publicKey, secretKey } = crypto.keyPair()
const message = Buffer.from("hello")
const signature = crypto.sign(message, secretKey)
const verified = crypto.verify(message, signature, publicKey)
if (verified) {
  // message was signed with secret key corresponding to the
  // given public that generated the given signature
}
```

### `crypto.uint64.encode(value, size)`

Encode an unsigned 64-bit big endian number into a buffer
of a given size defaulting to 8 bytes.

```js
const buffer = crypto.uint64.encode(80)
```

### `crypto.uint64.decode(buffer)`

Decode an unsigned 64-bit big endian buffer into a number

```js
const buffer = crypto.uint64.encode(80)
const number = crypto.uint64.decode(buffer) // 80
```

## License

LGPL-3.0
