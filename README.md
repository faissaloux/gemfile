# Gemfile

## Installation
#### npm
```bash
    npm install @faissaloux/gemfile
```

#### yarn
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
