# Yarn Workspaces Utils

Util commands for yarn workspaces. For now, working with flow and yarn workspaces is especially expected.

## Features

*   `ywu link`: create symlinks to modules into packages' `node_modules`.
*   `ywu unlink`: unlink modules.
*   `ywu clean`: remove all modules under `node_modules`.

To see possible options, run like `ywu link --help`.

## Installation

In project root,

```sh
yarn add -D yarn-workspaces-utils -W
```

Using `-W` option to supress the error below.

```txt
error Running this command will add the dependency to the workspace root rather than workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).
```

## Example

See `/example` in detail.

```json
{
    "scripts": {
        "utils": "ywu",
        "link": "ywu link",
        "unlink": "ywu unlink",
        "clean": "ywu clean",
        // hooks scripts
        "postinstall": "yarn link",
        "preuninstall": "yarn unlink && yarn clean"
    }
}
```

## Programatic Usage

```js
const ywu = require('yarn-workspaces-utils')

const cmdName = 'link'
const rootDir = process.cwd()

ywu(cmdName, {
    rootDir,
    destPath,  // Optional with 'link' & 'unlink'
    ignorePaths,  // Optional
    verbose,  // Optional
    silent,  // Optional
    workspaces,  // Optional
})
```