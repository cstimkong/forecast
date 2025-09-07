# FesaJS (The project is being reorganized)

This is the repository for `FesaJS`, a tool for detecting prototype pollution vulnerability.

For the information of prototype pollution, please refer to [Synk.io](https://learn.snyk.io/lesson/prototype-pollution/)

### Overall framework

The `FesaJS` framework comprises three phases:

- Forced execution assisted analysis

- Payload template generation

- Exploitation generation

### Installation

Please check out [INSTALL.md](INSTALL.md) for the detailed instruction of the installation.


### Usage

Use the following command:

```bash
node fesa.js [-h] [-p] [-m <node.js module path>] [-q | --quiet]  [-a | --all] [--timeout <timeout>] [--install] [--max-fe-iteration] [--detection-only]
```


### Requirements

- Node.js v20 and later

- TypeScript 5.9

- node-gyp

- Libev

- Python 3.9 or later

### Content

- The `curated_datasets` directory contains the NPM packages that are from Ferreira et al.'s works (we also check them manually).

- `npm_packages.json` is the package list that are used in our evaluation.

- The `curated_vul.csv` is the information of the vulnerabilitys in the curated datasets and the detection results.

- The `vul_inthewild.csv` contains the vulnerabilities detected in the wild collected from npm.

### Installation

1. Install node gyp from `npm`

2. Install Build Tools (Visual Studio Build Tools on Windows, or Xcode Application / Command Line Tools on macOS, or GCC on general UNIX/Linux systems)

3. Install Neo4j

4. Build libev

5. Using node gyp build the project


### References

- [ObjLupAnsys](https://github.com/song-li/objlupansys)

- [ODGen](https://github.com/song-li/ODGen)

- [Explode.js](https://github.com/formalsec/explode-js)

- [Graph.js](https://github.com/formalsec/graphjs)

- [Secbench.js](https://github.com/cristianstaicu/SecBench.js)

- [VulcaN](https://github.com/VulcaN-Study/Supplementary-Material)