# Forecast

This is the repository for `Forecast`, a tool for detecting prototype pollution vulnerability ([CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)).

For the information of prototype pollution, please refer to [Snyk.io](https://learn.snyk.io/lesson/prototype-pollution/)

### Overall framework

The `Forecast` framework comprises three phases:

- Forced execution based Fuzzing, which generates function call templates as the sketch for generating exploits

- Format-string Generation, which fill the function call templates with format strings

- Exploit Generation, which generates the exploit with the placeholders in the function call templates filled with concrete values


### Usage

Use `npm run dist` to build a standalone executable JavaScript file in `dist` directory.

Then use the following command:

```bash
node dist/forecast.js -h
```

to show the help information. The supported options are listed as follows.

| Parameter | Usage |
| --------- | ----- | 
| `-h`      | Print help information |
| `-a`, `--all`  | Find all sinks and exploits as possible |
| `-p`,`--path`  | The path to a JavaScript library, represented as a relative or absolute path (e.g., `./path/to/lib` or `/path/to/lib/file.js`) |
| `--max-execution-time` | Max count of forced execution of a function |
| `--max-api-calls` | Max number of the API calls in an exploit |
| `--candidate-only` | Only output candidate API call paths |
| `--debug`  | Output debug information | 
| `--log-file` | Output the logs to a specific file |

Note that the dependencies of the library should be installed first.

### Requirements

- Node.js v20 and later

- TypeScript compiler (version 5.9.x tested)

### Other Supplementaries

- `benchmark1` directory contains the NPM packages that are from prior works and the detected results.

- `benchmark2` directory contains the package list that are used in our evaluation and the detected results.

- `zero_days` directory contains the discovered zero-day vulnerabilities by Forecast.

### Publication

Effective Fuzzing-based Prototype Pollution Detection via Forced Execution and Template Synthesis, in ACM Transactions on Software Engineering and Methodology, accepted in 2026.

### References

- [ObjLupAnsys](https://github.com/song-li/objlupansys)

- [ODGen](https://github.com/song-li/ODGen)

- [Explode.js](https://github.com/formalsec/explode-js)

- [Graph.js](https://github.com/formalsec/graphjs)

- [Secbench.js](https://github.com/cristianstaicu/SecBench.js)

- [VulcaN](https://github.com/VulcaN-Study/Supplementary-Material)