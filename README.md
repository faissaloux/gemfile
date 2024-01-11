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

### Result

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
