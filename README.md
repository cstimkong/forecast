# FesaJS

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
node fesa.js [-h] [-p] [-m <node.js module path>] [-q] [-s] [-a] [--timeout TIMEOUT] [-l] [--install] [--max-fe-iteration] [--detection-only]
```


### Requirements

- Node.js v20 and later
- Neo4j v5.0 and later
- Libev 

### Content

- The `curated_datasets` directory contains the NPM packages that are from Ferreira et al.'s works (we also check them manually).

- `npm_packages.json` is the package list that are used in our evaluation.

- The `curated_vul.csv` is the information of the vulnerabilitys in the curated datasets and the detection results.
