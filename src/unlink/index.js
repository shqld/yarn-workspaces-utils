const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')

const fsUnlink = promisify(fs.unlink)

const createUnlinkTasks = (key, destPath, fns) =>
    fsUnlink(path.join(destPath, key))
        .then(() => {
            fns.log(`DONE: ${key}`)
        })
        .catch(err => {
            if (err.code === 'ENOENT') {
                // fns.warn(`WARNING: ${key} is not found.`)
            } else {
                fns.error(key, err)
            }
        })

const unlink = (opts, fns) => {
    const { rootDir, workspacePaths } = opts

    const tasks = []
    workspacePaths.forEach(workspacePath => {
        const destPath = opts.destPath
            ? path.resolve(opts.destPath)
            : path.join(workspacePath, 'node_modules')

        if (!fs.existsSync(destPath)) {
            return Promise.resolve()
        }

        const otherWorkspacePaths = workspacePaths.filter(
            p => p !== workspacePath
        )
        otherWorkspacePaths.forEach(otherWorkspacePath => {
            const { name } = path.parse(otherWorkspacePath)
            tasks.push(createUnlinkTasks(name, destPath, fns))
        })

        const childPackage = require(path.join(workspacePath, 'package.json'))

        const { dependencies, devDependencies } = childPackage

        if (dependencies) {
            Object.keys(dependencies).forEach(key =>
                tasks.push(createUnlinkTasks(key, destPath, fns))
            )
        }

        if (devDependencies) {
            Object.keys(devDependencies).forEach(key =>
                tasks.push(createUnlinkTasks(key, destPath, fns))
            )
        }
    })

    return Promise.all(tasks)
}

module.exports = unlink
