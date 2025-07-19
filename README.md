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
node fesa.js [-h] [-p] [-m <node.js module path>] [-q] [-s] [-a] [--timeout TIMEOUT] [-l] [--install] [--max-fe-iteration]
```

### Requirements

- Node.js v20 and later
- Neo4j v5.0 and later
- Libev 

