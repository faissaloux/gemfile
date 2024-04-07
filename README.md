# Gemfile

[![Tests](https://github.com/faissaloux/gemfile/actions/workflows/test.yml/badge.svg)](https://github.com/faissaloux/gemfile/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/faissaloux/gemfile/graph/badge.svg)](https://codecov.io/gh/faissaloux/gemfile) [![npm version](https://badge.fury.io/js/@faissaloux%2Fgemfile.svg)](https://badge.fury.io/js/@faissaloux%2Fgemfile) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/faissaloux/gemfile/blob/main/LICENSE)

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

You can either parse a whole Gemfile file by passing its name to `file()`.

```Gemfile
# Gemfile

gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
gem "error_highlight", ">= 0.4.0", platforms: :ruby
gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
```

```js
// index.js

import { Parser } from '@faissaloux/gemfile';

const parser = new Parser();

let parsed = parser.file('Gemfile').parse();
```

Or parse Gemfile text by passing it to `text()`.
```js
import { Parser } from '@faissaloux/gemfile';

const parser = new Parser();

let parsed = parser.text(`
    gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
    gem "error_highlight", ">= 0.4.0", platforms: :ruby
    gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
    gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
`).parse();
```
#### Result

```json
// console.log(parsed);

{
    "dependencies": [
        {
            "name": "json",
            "version": ">= 2.0.0, != 2.7.0",
            "platforms": [
                "windows",
                "jruby"
            ]
        },
        {
            "name": "error_highlight",
            "version": ">= 0.4.0",
            "platforms": [
                "ruby"
            ]
        },
        {
            "name": "sdoc",
            "git": "https://github.com/rails/sdoc.git",
            "branch": "main"
        },
        {
            "name": "websocket-client-simple",
            "require": "false",
            "github": "matthewd/websocket-client-simple",
            "branch": "close-race"
        }
    ]
}
```

---

### Gemfile.lock

You can use `file()` to parse the Gemfile.lock file.

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

PLATFORMS
  ruby
  x86_64-darwin
  x86_64-linux

DEPENDENCIES
  activerecord-jdbcmysql-adapter (>= 1.3.0)
  aws-sdk-s3
```

```javascript
import { LockParser } from '@faissaloux/gemfile';

const lockParser = new LockParser();

let parsed = lockParser.file('Gemfile.lock').parse();
```
Or you can use `text()` to parse Gemfile.lock content.

```javascript
import { LockParser } from '@faissaloux/gemfile';

const lockParser = new LockParser();

let parsed = lockParser.text(`PATH
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

PLATFORMS
  ruby
  x86_64-darwin
  x86_64-linux

DEPENDENCIES
  activerecord-jdbcmysql-adapter (>= 1.3.0)
  aws-sdk-s3
`).parse();
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
    },
    "PLATFORMS": [
        "ruby",
        "x86_64-darwin",
        "x86_64-linux"
    ],
    "DEPENDENCIES": [
        "activerecord-jdbcmysql-adapter (>= 1.3.0)",
        "aws-sdk-s3"
    ]
}
```

### Only
You can choose which elements to return using `only()`.

```javascript
Parser.only("name", "platforms");
```

```javascript
import { Parser } from '@faissaloux/gemfile';

Parser.only("name", "platforms");

const parser = new Parser();
let parsed = parser.text(`
    gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
    gem "error_highlight", ">= 0.4.0", platforms: :ruby
    gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
    gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
`).parse();
```

```json
// console.log(parsed);

{
    "dependencies": [
        {
            "name": "json",
            "platforms": [
                "windows",
                "jruby"
            ]
        },
        {
            "name": "error_highlight",
            "platforms": [
                "ruby"
            ]
        },
        {
            "name": "sdoc"
        },
        {
            "name": "websocket-client-simple"
        }
    ]
}
```