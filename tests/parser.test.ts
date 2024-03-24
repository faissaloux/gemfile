import Parser from '../src/Parser';

test('parser one line text contains dependency name', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "error_highlight"
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"error_highlight"}]}`);
});

test('parser one line text contains dependency name and simple version', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "error_highlight", ">= 0.4.0"
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"error_highlight","version":">= 0.4.0"}]}`);
});

test('parser one line text contains dependency name and composed version', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "json", ">= 2.0.0", "!=2.7.0"
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0"}]}`);
});

test('parser one line text contains dependency name, version and one platform', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "error_highlight", ">= 0.4.0", platforms: :ruby
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"error_highlight","version":">= 0.4.0","platforms":["ruby"]}]}`);
});

test('parser one line text contains dependency name, version and multiple platforms', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0","platforms":["windows","jruby"]}]}`);
});

test('parser one line text contains dependency name and git', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "sdoc", git: "https://github.com/rails/sdoc.git"
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"sdoc","git":"https://github.com/rails/sdoc.git"}]}`);
});

test('parser one line text contains dependency name, git and branch', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"sdoc","git":"https://github.com/rails/sdoc.git","branch":"main"}]}`);
});

test('parser one line text contains dependency name and require', () => {
  const parser = new Parser();

  let parsed = parser.text(`
    gem "sdoc", require: false
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"sdoc","require":"false"}]}`);
});

test('parser multiple lines text', () => {
  const parser = new Parser();

  let parsed = parser.text(`
      gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
      gem "error_highlight", ">= 0.4.0", platforms: :ruby
      gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
      gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
  `).parse();

  expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0","platforms":["windows","jruby"]},{"name":"error_highlight","version":">= 0.4.0","platforms":["ruby"]},{"name":"sdoc","git":"https://github.com/rails/sdoc.git","branch":"main"},{"name":"websocket-client-simple","require":"false","github":"matthewd/websocket-client-simple","branch":"close-race"}]}`);
});