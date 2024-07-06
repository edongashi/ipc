import minimist from 'minimist';

export function parseArgs(args: string[]) {
  const mapped = args.reduce(
    (acc, arg) => {
      const matches = arg.match(/^--str:(.+)/);
      if (matches) {
        acc.strings.push(matches[1]);
        acc.args.push(`--${matches[1]}`);
      } else {
        acc.args.push(arg);
      }

      return acc;
    },
    { args: [] as string[], strings: [] as string[] },
  );

  return minimist(mapped.args, {
    string: mapped.strings,
  });
}
