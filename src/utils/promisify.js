const util = require('util')

if (!util.promisify) {
    const promisify = func => (...args) => {
        return new Promise((resolve, reject) => {
            func(...args, (err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve(data)
            })
        })
    }

    module.exports = promisify
} else {
    module.exports = util.promisify
}
