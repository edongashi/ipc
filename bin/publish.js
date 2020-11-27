#!/usr/bin/env node
const { parseArgs } = require('../src/utils')
const { publish, shutdown } = require('../src')

const [_node, _file, queue, ...args] = process.argv
const parsedArgs = parseArgs(args)
parsedArgs.$args = args

publish(queue, parsedArgs).then(shutdown, (error) => {
  console.error(error)
  shutdown()
})
