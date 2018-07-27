/* eslint-disable no-inline-comments */

const kPrimitivePolynomials = [
  null, null, 1, 3, 3, 5, 3, 3,
  29, 17, 9, 5, 83, 27, 43, 3,
  45, 9, 39, 39, 9, 5, 3, 33,
  27, 9, 71, 39, 9, 5, 83,
]

/**
 * A table of logs and exps
 * @class Table
 */
class Table {
  /**
   * Table class constructor.
   * @public
   * @param {Context} ctx
   * @param {Number} ctx.size
   * @param {Number} ctx.maxShares
   */
  constructor(ctx) {
    if (!ctx || 'object' !== typeof ctx) {
      throw new TypeError('Table: Expecting context to be an object.')
    }

    const { size, maxShares } = ctx

    if ('number' !== typeof size) {
      throw new RangeError('Table: Expecting size to be a number.')
    }

    if (0 !== size % 1 || size <= 0) {
      throw new RangeError('Table: Expecting size to be a positive number.')
    }

    if (undefined === kPrimitivePolynomials[ctx.bits]) {
      throw new TypeError(`Context: bits (2^${ctx.bits}) out of range.`)
    }

    const primitive = kPrimitivePolynomials[ctx.bits]

    this.logs = new Array(size)
    this.exps = new Array(size)

    this.logs[0] = 0

    for (let i = 0, x = 1; i < size; ++i) {
      this.exps[i] = x
      this.logs[x] = i
      // eslint-disable-next-line no-bitwise
      x <<= 1
      if (size <= x) {
        // eslint-disable-next-line no-bitwise
        x ^= primitive
        // eslint-disable-next-line no-bitwise
        x &= maxShares
      }
    }
  }
}

module.exports = {
  Table
}
