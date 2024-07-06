#!/usr/bin/env node
const { parseArgs } = require('../dist/utils');
const { cast, shutdown } = require('../dist');

const [_node, _file, queue, ...args] = process.argv;
const parsedArgs = parseArgs(args);
parsedArgs.$args = args;

cast(queue, parsedArgs).then(shutdown, (error) => {
  console.error(error);
  shutdown();
});
