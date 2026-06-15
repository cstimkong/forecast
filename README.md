# Forecast

This is the repository for `Forecast`, a tool for detecting prototype pollution vulnerability ([CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)).

For the information of prototype pollution, please refer to [Snyk.io](https://learn.snyk.io/lesson/prototype-pollution/)

### Overall framework

The `Forecast` framework comprises three phases:

- Forced execution based Fuzzing

- Format-string Generation

- Exploit Generation


### Usage

Use `npm run dist` to build a standalone executable JavaScript file in `dist` directory.

Then use the following command:

```bash
node dist/forecast.js [-h] <[-p | --path] module_path> [-a | --all] [--timeout <timeout>] [--max-execution-time] [--detection-only] [--debug]
```


### Requirements

- Node.js v20 and later

- TypeScript compiler

### Other Supplementaries

- `benchmark1` directory contains the NPM packages that are from prior works and the detected results.

- `benchmark2` directory contains the package list that are used in our evaluation and the detected results.

- `zero_days` directory contains the discovered zero-day vulnerabilities by Forecast.


### References

- [ObjLupAnsys](https://github.com/song-li/objlupansys)

- [ODGen](https://github.com/song-li/ODGen)

- [Explode.js](https://github.com/formalsec/explode-js)

- [Graph.js](https://github.com/formalsec/graphjs)

- [Secbench.js](https://github.com/cristianstaicu/SecBench.js)

- [VulcaN](https://github.com/VulcaN-Study/Supplementary-Material)