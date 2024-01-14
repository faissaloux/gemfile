# Gemfile

[![npm version](https://badge.fury.io/js/@faissaloux%2Fgemfile.svg)](https://badge.fury.io/js/@faissaloux%2Fgemfile) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/faissaloux/gemfile/blob/main/LICENSE)

## Installation
Install `@faissaloux/gemfile` using the package manager you want:

```bash
    npm install @faissaloux/gemfile
```
```bash
    yarn add @faissaloux/gemfile
```

## Usage

`@faissaloux/gemfile` can parse both `Gemfile` and `Gemfile.lock`.

### Gemfile

```Gemfile
# Gemfile

gem "json", ">= 2.0.0", "!=2.7.0", platforms: :windows
gem "error_highlight", ">= 0.4.0", platforms: :ruby
gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
```

```js
// index.js

import { Parser } from '@faissaloux/gemfile';

const parser = new Parser();

let parsed = parser.parse('Gemfile');
```

#### Result

```json
// console.log(parsed);

{
    "dependencies":[
            {
                "name":"json",
                "version":">= 2.0.0, != 2.7.0"
            },
            {
                "name":"error_highlight",
                "version":">= 0.4.0"
            },
            {
                "name":"websocket-client-simple"
            }
        ]
}
```

---

### Gemfile.lock

```Gemfile.lock
PATH
  remote: .
  specs:
    actioncable (7.2.0.alpha)
      actionpack (= 7.2.0.alpha)
      activesupport (= 7.2.0.alpha)
      nio4r (~> 2.0)
      websocket-driver (>= 0.6.1)
      zeitwerk (~> 2.6)

GEM
  remote: https://rubygems.org/
  specs:
    addressable (2.8.6)
      public_suffix (>= 2.0.2, < 6.0)
    amq-protocol (2.3.2)
    ast (2.4.2)
    aws-eventstream (1.3.0)
    aws-partitions (1.876.0)
    aws-sdk-core (3.190.1)
      aws-eventstream (~> 1, >= 1.3.0)
      aws-partitions (~> 1, >= 1.651.0)
      aws-sigv4 (~> 1.8)
      jmespath (~> 1, >= 1.6.1)
```

```javascript
import { LockParser } from '@faissaloux/gemfile';

const lockParser = new LockParser();

let parsed = lockParser.parse('Gemfile.lock');
```

#### Result
```json
// console.log(parsed);

{
    "PATH": {
        "remote": ".",
        "specs": {
            "actioncable (7.2.0.alpha)": [
                "actionpack (= 7.2.0.alpha)",
                "activesupport (= 7.2.0.alpha)",
                "nio4r (~> 2.0)",
                "websocket-driver (>= 0.6.1)",
                "zeitwerk (~> 2.6)"
            ]
        }
    },
    "GEM": {
        "remote": "https://rubygems.org/",
        "specs": {
            "addressable (2.8.6)": [
                "public_suffix (>= 2.0.2, < 6.0)"
            ],
            "amq-protocol (2.3.2)": [],
            "ast (2.4.2)": [],
            "aws-eventstream (1.3.0)": [],
            "aws-partitions (1.876.0)": [],
            "aws-sdk-core (3.190.1)": [
                "aws-eventstream (~> 1, >= 1.3.0)",
                "aws-partitions (~> 1, >= 1.651.0)",
                "aws-sigv4 (~> 1.8)",
                "jmespath (~> 1, >= 1.6.1)"
            ]
        }
    }
}
```