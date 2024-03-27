import Parser from '../src/Parser';

describe('parser', () => {
  const parser = new Parser();

  describe('text parser', () => {
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
    test('unexisted file', () => {
      expect(() => parser.file('tests/files/unexisted').parse()).toThrow(Error);
    });

    test('parse', () => {
      let parsed = parser.file('tests/files/Gemfile').parse();
  
      expect(() => JSON.parse(parsed)).not.toThrow(Error);
      expect(parsed).toBe(`{"dependencies":[{"name":"json","version":">= 2.0.0, != 2.7.0","platforms":["windows","jruby"]},{"name":"error_highlight","version":">= 0.4.0","platforms":["ruby"]},{"name":"sdoc","git":"https://github.com/rails/sdoc.git","branch":"main"},{"name":"websocket-client-simple","require":"false","github":"matthewd/websocket-client-simple","branch":"close-race"}]}`);
    });
  });
});
