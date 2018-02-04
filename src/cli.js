const cm = require('commander')
const main = require('./index')

const run = (cmdName, cmdr) => {
    main(cmdName, {
        rootDir: cmdr.rootDir,
        destPath: cmdr.dest,
        ignorePaths: cmdr.ignorePaths,
        verbose: cmdr.verbose,
        silent: cmdr.silent,
        workspaces: cmdr.workspaces,
    })
    .catch(console.error)
}

const cli = () => {
    cm.version('0.0.1')
    cm
        .name('ywu')
        .usage('<command> [options] ')
        .option('--rootDir <dir>')
        .option('--verbose')
        .option('--silent')
    cm
        .command('link')
        .option('-d, --dest <dir>', 'Where to install deps')
        .option('--workspaces', 'Link workspaces too.')
        // .option('--ignore <dir>', 'Ignore dir')
        .action(cmdr => run('link', cmdr))
    cm
        .command('unlink')
        .option('-d, --dest <dir>', 'Where to install deps')
        .action(cmdr => run('unlink', cmdr))

    cm.command('clean').action(cmdr => run('clean', cmdr))

    cm.parse(process.argv)
}

module.exports = cli
