const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const promisify = require('../utils/promisify')

const fsSymlink = promisify(fs.symlink)

const createLinkTasks = (key, originPath, destPath, fns) =>
    fsSymlink(path.join(originPath, key), path.join(destPath, key))
        .then(() => {
            fns.log(`DONE: ${key}`)
        })
        .catch(err => {
            if (err.code === 'EEXIST') {
                // fns.warn(`WARNING: ${key} exists.`)
            } else {
                fns.error(key, err)
            }
        })

const link = (opts, fns) => {
    const { rootDir, workspacePaths } = opts

    const originPath = path.join(rootDir, 'node_modules')

    if (!fs.existsSync(originPath)) {
        return Promise.reject('No node_modules in root')
    }

    const tasks = []
    workspacePaths.forEach(workspacePath => {
        const destPath = opts.destPath
            ? path.resolve(opts.destPath)
            : path.join(workspacePath, 'node_modules')

        if (!fs.existsSync(destPath)) {
            mkdirp.sync(destPath)
        }

        if (opts.workspaces) {
            const otherWorkspacePaths = workspacePaths.filter(
                p => p !== workspacePath
            )
            otherWorkspacePaths.forEach(otherWorkspacePath => {
                const { dir, name } = path.parse(otherWorkspacePath)
                tasks.push(createLinkTasks(name, dir, destPath, fns))
            })
        }

        const childPackage = require(path.join(workspacePath, 'package.json'))

        const { dependencies, devDependencies } = childPackage

        if (dependencies) {
            Object.keys(dependencies).forEach(key =>
                tasks.push(createLinkTasks(key, originPath, destPath, fns))
            )
        }

        if (devDependencies) {
            Object.keys(devDependencies).forEach(key =>
                tasks.push(createLinkTasks(key, originPath, destPath, fns))
            )
        }
    })

    return Promise.all(tasks)
}

module.exports = link
