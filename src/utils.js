const minimist = require('minimist')

function parseArgs(args) {
  const mapped = args.reduce(
    (acc, arg) => {
      const matches = arg.match(/--str:(.+)/)
      if (matches) {
        acc.strings.push(matches[1])
        acc.args.push(`--${matches[1]}`)
      } else {
        acc.args.push(arg)
      }

      return acc
    },
    { args: [], strings: [] }
  )

  return minimist(mapped.args, {
    string: mapped.strings
  })
}

module.exports = {
  parseArgs
}
