# Forecast (The project is being reorganized)

This is the repository for `Forecast`, a tool for detecting prototype pollution vulnerability.

For the information of prototype pollution, please refer to [Synk.io](https://learn.snyk.io/lesson/prototype-pollution/)

### Overall framework

The `Forecast` framework comprises three phases:

- Forced execution based Fuzzing

- Template generation based Fuzzing

- Exploit generation

### How to build

Use `npm run dist` to build a standalone executable JavaScript file in `dist` directory.

### Usage

Use the following command:

```
node dist/forecast.js [-h] <[-p | --path] module_path> [-a | --all] [--timeout <timeout>] [--max-execution-time] [--detection-only] [--debug]
```


### Requirements

- Node.js v20 and later

- TypeScript compiler

### Other Supplementaries

- The `benchmark1` directory contains the NPM packages that are from prior works and the detected results.

- The `benchmark2` directory contains the package list that are used in our evaluation and the detected results.


### References

- [ObjLupAnsys](https://github.com/song-li/objlupansys)

- [ODGen](https://github.com/song-li/ODGen)

- [Explode.js](https://github.com/formalsec/explode-js)

- [Graph.js](https://github.com/formalsec/graphjs)

- [Secbench.js](https://github.com/cristianstaicu/SecBench.js)

- [VulcaN](https://github.com/VulcaN-Study/Supplementary-Material)