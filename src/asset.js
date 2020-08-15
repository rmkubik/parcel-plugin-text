'use strict'

const { Asset } = require('parcel-bundler')
const log = require('loglevel')
const merge = require('lodash.merge')

module.exports = class TextAsset extends Asset {
  constructor (name, pkg, options) {
    super(name, pkg, options)
    this.type = 'js'
  }

  async generate () {
    const customConfig = await this.getConfig(['.parcel-plugin-textrc', 'package.json'])
    const defaultOptions = {
      replacers: {
        escapeBackSlashes: false
      }
    }
    const pluginOptions = merge(
      defaultOptions,
      customConfig['parcel-plugin-text'] || customConfig
    )

    let content = this.contents

    if (pluginOptions.replacers.escapeBackSlashes) {
      content = content.replace(/\\/g, '\\\\')
    }

    content = content
      .replace(/`/g, '\\`')
      .replace(/\$(?=\{.*?\})/g, '\\$')

    log.debug({ loaded: this.name })
    log.trace({ content })

    return [{
      type: 'js',
      value: `module.exports = \`${content}\``
    }]
  }
}
