import Parser from '../src/Parser';

describe('parser', () => {
  describe('text parser', () => {
    const parser = new Parser();

    test('parse one line contains dependency name', () => {
      let parsed = parser.text(`
        gem "error_highlight"
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"error_highlight"}]}`);
    });

    test('parse one line contains dependency name and simple version', () => {
      let parsed = parser.text(`
        gem "error_highlight", ">= 0.4.0"
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"error_highlight","version":">= 0.4.0"}]}`);
    });

    test('parse one line contains dependency name and composed version', () => {
      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0"
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0"}]}`);
    });

    test('parse one line contains dependency name, version and one platform', () => {
      let parsed = parser.text(`
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"error_highlight","version":">= 0.4.0","platforms":["ruby"]}]}`);
    });

    test('parse one line contains dependency name, version and multiple platforms', () => {
      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0","platforms":["windows","jruby"]}]}`);
    });

    test('parse one line contains dependency name and git', () => {
      let parsed = parser.text(`
        gem "sdoc", git: "https://github.com/rails/sdoc.git"
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"sdoc","git":"https://github.com/rails/sdoc.git"}]}`);
    });

    test('parse one line contains dependency name, git and branch', () => {
      let parsed = parser.text(`
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"sdoc","git":"https://github.com/rails/sdoc.git","branch":"main"}]}`);
    });

    test('parse one line contains dependency name and require', () => {
      let parsed = parser.text(`
        gem "sdoc", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"sdoc","require":"false"}]}`);
    });

    test('parse multiple lines', () => {
      let parsed = parser.text(`
          gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
          gem "error_highlight", ">= 0.4.0", platforms: :ruby
          gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
          gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0","platforms":["windows","jruby"]},{"name":"error_highlight","version":">= 0.4.0","platforms":["ruby"]},{"name":"sdoc","git":"https://github.com/rails/sdoc.git","branch":"main"},{"name":"websocket-client-simple","require":"false","github":"matthewd/websocket-client-simple","branch":"close-race"}]}`);
    });
  });

  describe('file parser', () => {
    const parser = new Parser();

    test('unexisted file', () => {
      expect(() => parser.file('tests/files/unexisted').parse()).toThrow(Error);
    });

    test('parse', () => {
      let parsed = parser.file('tests/files/Gemfile').parse();
  
      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0","platforms":["windows","jruby"]},{"name":"error_highlight","version":">= 0.4.0","platforms":["ruby"]},{"name":"sdoc","git":"https://github.com/rails/sdoc.git","branch":"main"},{"name":"websocket-client-simple","require":"false","github":"matthewd/websocket-client-simple","branch":"close-race"}]}`);
    });
  });

  describe('only', () => {
    test('parse one line specifying one element to return', () => {
      const parser = new Parser();
      Parser.only("name");

      let parsed = parser.text(`
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"sdoc"}]}`);
    });

    test('parse multiple lines specifying one element to return', () => {
      const parser = new Parser();
      Parser.only("name");

      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
        gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json"},{"name":"error_highlight"},{"name":"sdoc"},{"name":"websocket-client-simple"}]}`);
    });

    test('parse multiple lines specifying one element to return that does not exist in all lines', () => {
      const parser = new Parser();
      Parser.only("platforms");

      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
        gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"platforms":["windows","jruby"]},{"platforms":["ruby"]}]}`);
    });

    test('parse multiple lines specifying multiple elements to return', () => {
      const parser = new Parser();
      Parser.only("platforms");
      Parser.only("name");

      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
        gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","platforms":["windows","jruby"]},{"name":"error_highlight","platforms":["ruby"]},{"name":"sdoc"},{"name":"websocket-client-simple"}]}`);
    });

    test('parse multiple lines specifying multiple elements (duplicated) to return', () => {
      const parser = new Parser();
      Parser.only("name");
      Parser.only("platforms");
      Parser.only("name");

      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
        gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","platforms":["windows","jruby"]},{"name":"error_highlight","platforms":["ruby"]},{"name":"sdoc"},{"name":"websocket-client-simple"}]}`);
    });

    test('parse multiple lines specifying multiple elements to return in one line', () => {
      const parser = new Parser();
      Parser.only("platforms", "name");

      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
        gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","platforms":["windows","jruby"]},{"name":"error_highlight","platforms":["ruby"]},{"name":"sdoc"},{"name":"websocket-client-simple"}]}`);
    });

    test('parse multiple lines specifying multiple elements to return mixed', () => {
      const parser = new Parser();
      Parser.only("platforms", "name");
      Parser.only("branch");

      let parsed = parser.text(`
        gem "json", ">= 2.0.0", "!=2.7.0", platforms: [:windows, :jruby]
        gem "error_highlight", ">= 0.4.0", platforms: :ruby
        gem "sdoc", git: "https://github.com/rails/sdoc.git", branch: "main"
        gem "websocket-client-simple", github: "matthewd/websocket-client-simple", branch: "close-race", require: false
      `).parse();

      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","platforms":["windows","jruby"]},{"name":"error_highlight","platforms":["ruby"]},{"name":"sdoc","branch":"main"},{"name":"websocket-client-simple","branch":"close-race"}]}`);
    });
  });
});
