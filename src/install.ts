/* eslint-disable */
/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

const path = require("path")

function extendConf(conf: any) {
  // register our boot file
  conf.boot.push("~@sowell/quasar-app-extension-rxdb/src/boot/index.js")
  conf.build.transpileDependencies.push(/quasar-app-extension-rxdb[\\/]src/)
}

const chainWebpack = (ctx: any, chain: any) => {
  chain.resolve.alias.set(
    "@sowell/rxdb",
    // eslint-disable-next-line no-undef
    path.resolve(__dirname, "./rxdb/replication")
  )
}

module.exports = function (api: any) {
  api.compatibleWith("quasar", "^2.0.0-beta.1")
  api.compatibleWith("@quasar/app", "^3.0.0-beta.1")
  api.chainWebpack((chain: any) => chainWebpack(api.ctx, chain))
  api.extendQuasarConf(extendConf)
}
