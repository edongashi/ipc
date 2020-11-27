#!/usr/bin/env node
const { parseArgs } = require('../src/utils')
const { cast, shutdown } = require('../src')

const [_node, _file, queue, ...args] = process.argv
const parsedArgs = parseArgs(args)
parsedArgs.$args = args

cast(queue, parsedArgs).then(shutdown, (error) => {
  console.error(error)
  shutdown()
})
