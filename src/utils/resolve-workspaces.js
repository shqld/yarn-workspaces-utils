const fs = require('fs')
const path = require('path')

const resolveWorkspaces = (workspaces, rootDir) => {
    const resolved = []
    workspaces.forEach(workspacePath => {
        const baseName = path.basename(workspacePath)

        if (baseName === '*') {
            const dirName = path.dirname(workspacePath)
            resolved.push(
                ...fs
                    .readdirSync(path.join(rootDir, dirName))
                    .map(p => path.join(dirName, p))
            )
        } else {
            resolved.push(workspacePath)
        }
    })

    return resolved.map(p => path.join(rootDir, p))
}

module.exports = resolveWorkspaces
