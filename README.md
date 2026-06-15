# eth-rpc-errors-maintained

> Actively maintained drop-in replacement for the abandoned [eth-rpc-errors](https://www.npmjs.com/package/eth-rpc-errors) package (850K+ weekly downloads, last updated 5 years ago).

## Why this fork exists

The original `eth-rpc-errors` package:
- Has not received a commit or release in **5 years**
- Has **332 dependent packages** relying on it
- The maintainers moved on to `@metamask/rpc-errors` without providing migration support
- Thousands of projects still install it weekly via lockfiles

This package keeps the **exact same API** — no breaking changes. One line to migrate.

## Installation

```bash
npm install eth-rpc-errors-maintained
