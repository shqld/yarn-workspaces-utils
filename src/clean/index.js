const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')

const rimraf = promisify(require('rimraf'))

const clean = (opts, fns) => {
    const { rootDir, workspacePaths, workspace } = opts

    if (workspace) {
        return rimraf(path.join(path.resolve(workspace), 'node_modules'))
    }

    const tasks = [rimraf(path.join(rootDir, 'node_modules'))]

    workspacePaths.forEach(workspacePath => {
        fns.log(`${workspacePath}`)
        const destPath = path.join(workspacePath, 'node_modules')

        tasks.push(rimraf(destPath))
    })

    return Promise.all(tasks)
}

module.exports = clean
