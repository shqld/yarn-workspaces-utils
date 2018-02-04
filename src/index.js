const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const chalk = require('chalk')

const AVAILABLE_CMDS = require('./cmds')
const resolveWorkspaces = require('./utils/resolve-workspaces')

const main = (cmdName, opts = {}) => {
    if (!cmdName) {
        return Promise.reject(`No command`)
    }
    const cmd = AVAILABLE_CMDS[cmdName]

    if (!cmd) {
        return Promise.reject(`No command for '${cmdName}'`)
    }

    const log = opts.verbose && !opts.silent ? console.log : () => {}
    const warn = !opts.silent ? console.warn : () => {}
    const error = !opts.silent ? console.error : () => {}

    const rootDir = opts.rootDir || process.cwd()
    const rootPackagePath = path.join(path.resolve(rootDir), 'package.json')
    if (!fs.existsSync(rootPackagePath)) {
        return Promise.reject('No package.json')
    }
    const rootPackage = require(rootPackagePath)
    if (!rootPackage.workspaces) {
        return Promise.reject('Not root directory')
    }
    const workspacePaths = resolveWorkspaces(rootPackage.workspaces, rootDir)

    return cmd(
        Object.assign(opts, {
            rootDir,
            rootPackage,
            workspacePaths,
        }),
        { info: console.info, log, warn, error }
    )
        .then(() => {
            console.log(chalk.bold.green('DONE'))
        })
        .catch(err => {
            console.error(chalk.bold.red('ERROR'), err)
        })
}

module.exports = main
