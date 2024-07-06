#!/usr/bin/env node
const { parseArgs } = require('../dist/utils');
const { call, shutdown } = require('../dist');

const [_node, _file, queue, ...args] = process.argv;
const parsedArgs = parseArgs(args);
parsedArgs.$args = args;

call(queue, parsedArgs).then(
  (result) => {
    console.log(result);
    shutdown();
  },
  (error) => {
    console.error(error);
    shutdown();
  },
);
