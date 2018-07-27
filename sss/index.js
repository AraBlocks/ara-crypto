const { SharePoint, ShareData } = require('./share')
const { isSecret, Secret } = require('./secret')
const { Context } = require('./context')
const { Table } = require('./table')
const { Codec } = require('./codec')
const {
  recover,
  secret,
  shares,
  init
} = require('./sss')

module.exports = {
  SharePoint,
  ShareData,
  isSecret,
  Context,
  Secret,
  Table,
  Codec,

  recover,
  secret,
  shares,
  init,
}
