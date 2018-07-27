/* eslint-disable no-inline-comments */
const isBuffer = require('is-buffer')

/**
 * @public
 * @class SharePoint
 */
class SharePoint {
  /**
   * SharePoint class constructor.
   * @public
   * @constructor
   * @param {Context} ctx
   * @param {Object} opts
   */
  constructor(ctx, opts) {
    this.x = opts.x
    this.y = opts.y
  }
}

/**
 * A class for representing share data.
 * @public
 * @class ShareData
 */
class ShareData {
  /**
   * Parse input into a ShareData instance.
   * @public
   * @static
   * @param {String|Buffer|Object} input
   * @param {?(Object)} opts
   * @return {ShareData}
   */
  static parse(input, opts) {
    if (!opts) {
      // eslint-disable-next-line no-param-reassign
      opts = {}
    }

    if (!opts.radix) {
      // eslint-disable-next-line no-param-reassign
      opts.radix = 16
    }

    if (isBuffer(input)) {
      // only deal with string input
      // eslint-disable-next-line no-param-reassign
      input = input.toString('hex')
    }

    if ('string' === typeof input) {
      // remove leading 0
      if ('0' === input[0]) {
        // eslint-disable-next-line no-param-reassign
        input = input.slice(1)
      }

      const result = { id: null, bits: null, data: null }
      // bits are store in first byte as a base36 value
      result.bits = parseInt(input.slice(0, 1), 36)

      const maxBits = (2 ** result.bits) - 1
      const idLength = maxBits.toString(opts.radix).length
      const regex = `^([a-kA-K3-9]{1})([a-fA-F0-9]{${idLength}})([a-fA-F0-9]+)$`
      const matches = new RegExp(regex).exec(input)

      if (matches && matches.length) {
        result.id = parseInt(matches[2], opts.radix)
        // eslint-disable-next-line
        result.data = matches[3]
      }

      return result
    }

    if (input && 'object' === typeof input) {
      if (input.id && input.bits && input.data) {
        return input
      }
    }

    throw new TypeError('Unsupported input.')
  }

  /**
   * ShareData class constructor.
   * @public
   * @constructor
   * @param {Context} ctx
   * @param {String|Buffer|Object} share
   */
  constructor(ctx, share) {
    const parsed = ShareData.parse(share, ctx)
    this.id = parsed.id
    this.bits = parsed.bits
    this.data = parsed.data
  }
}

module.exports = {
  SharePoint,
  ShareData,
}
