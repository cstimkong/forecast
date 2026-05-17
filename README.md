# Forecast (The project is being reorganized)

This is the repository for `Forecast`, a tool for detecting prototype pollution vulnerability.

For the information of prototype pollution, please refer to [Synk.io](https://learn.snyk.io/lesson/prototype-pollution/)

### Overall framework

The `Forecast` framework comprises three phases:

- Forced execution based Fuzzing

- Function Call Template Refinement

- Exploitation


### Usage

Use the following command:

```bash
node forecast.js [-h] [-p] [-m <node.js module path>] [-q | --quiet]  [-a | --all] [--timeout <timeout>] [--install] [--max-fe-iteration] [--detection-only]
```


### Requirements

- Node.js v20 and later

- TypeScript 5.9

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