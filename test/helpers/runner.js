/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// we need to tell browserify about these modules when they
// are being bundled so they can be required at runtime
// without throwing an error
require('blue-tape')
// we do not need to require 'ava' as it will never run in a browser
// require('ava')

// possible test runners by name stored in constants
const BLUE_TAPE = 'blue-tape'
const AVA = 'ava'

// this variable will represent our test runner which could
// be one of the following:
//   - ava
//   - blue-tape
let test = null

// we determine 'blue-tape' to be a safe test runner if all else fails...
// the monkey patching of 'test.cb()' should make tests written for ava
// still work. promise based tests should _just_ work
const SAFE_TEST_RUNNER = BLUE_TAPE

// we can determine if 'ava' should be the default test runner if
// the 'AVA_PATH' environment variable is present in the process.env
// object, otherwise we default to 'blue-tape'
const DEFAULT_TEST_RUNNER = 'AVA_PATH' in process.env ? AVA : BLUE_TAPE

// the rest runner can be overloaded by the execution environment
// using the variable of the same name (TEST_RUNNER) defaulting to
// the determined default test runner
const TEST_RUNNER = process.env.TEST_RUNNER || DEFAULT_TEST_RUNNER

// dynamically require the test runner falling back
try {
  test = require(TEST_RUNNER)
} catch (err) {
  // eslint-disable-next-line import/no-dynamic-require
  test = require(SAFE_TEST_RUNNER)
}

// uncomment below to force a test runner
// test = require('blue-tape')
// test = require('ava')

if (!test || 'function' !== typeof test) {
  throw new TypeError('Unable to determine a test runner.')
}

// default test runner export
module.exports = test

// monkey patch 'test.cb()' to allow test runners that don't
// support 'test.cb()' to work with ones that do
if ('function' !== typeof test.cb) {
  test.cb = test
}
