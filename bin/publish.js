#!/usr/bin/env node
const { parseArgs } = require('../dist/utils');
const { publish, shutdown } = require('../dist');

const [_node, _file, channel, ...args] = process.argv;
const parsedArgs = parseArgs(args);
parsedArgs.$args = args;

publish(channel, parsedArgs).then(shutdown, (error) => {
  console.error(error);
  shutdown();
});
