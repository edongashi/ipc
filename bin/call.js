#!/usr/bin/env node
const { parseArgs } = require('../src/utils')
const { call, shutdown } = require('../src')

const [_node, _file, queue, ...args] = process.argv
const parsedArgs = parseArgs(args)
parsedArgs.$args = args

call(queue, parsedArgs).then(
  (result) => {
    console.log(result)
    shutdown()
  },
  (error) => {
    console.error(error)
    shutdown()
  }
)
