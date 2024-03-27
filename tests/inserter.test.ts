import Inserter from '../src/Inserter';

describe('inserter', () => {
    test('insert one line contains name', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "error_highlight"']).insert();

        expect(dependency).toStrictEqual({"name": "error_highlight"});
    });

    test('insert one line contains name and simple version', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "error_highlight"', '"~> 0.4.0"']).insert();

        expect(dependency).toStrictEqual({"name": "error_highlight", "version": "~> 0.4.0"});
    });

    test('insert one line contains name and composed version', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "json"', '"<= 2.0.0"', '"=2.7.0"']).insert();

        expect(dependency).toStrictEqual({"name": "json", "version": "<= 2.0.0, = 2.7.0"});
    });

    test('insert one line contains name, version and one platform', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "error_highlight"', '"> 0.4.0"', 'platforms: :ruby']).insert();

        expect(dependency).toStrictEqual({"name": "error_highlight", "version": "> 0.4.0", "platforms": ["ruby"]});
    });

    test('insert one line contains name, version and multiple platforms', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "json"', '"< 2.0.0"', '"!= 2.7.0"', 'platforms: [:windows, :ruby]']).insert();

        expect(dependency).toStrictEqual({"name": "json", "version": "< 2.0.0, != 2.7.0", "platforms": ["windows", "ruby"]});
    });

    test('insert one line contains name and git', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "sdoc"', 'git: "https://github.com/rails/sdoc.git"']).insert();

        expect(dependency).toStrictEqual({"name": "sdoc", "git": "https://github.com/rails/sdoc.git"});
    });

    test('insert one line contains name, git and branch', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "sdoc"', 'git: "https://github.com/rails/sdoc.git"', 'branch: "main"']).insert();

        expect(dependency).toStrictEqual({"name": "sdoc", "git": "https://github.com/rails/sdoc.git", "branch": "main"});
    });

    test('insert one line contains name and require', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, ['gem "sdoc"', 'require: false']).insert();

        expect(dependency).toStrictEqual({"name": "sdoc", "require": "false"});
    });

    test('insert one line contains name, github, branch and require', () => {
        let dependency: {[key: string]: string} = {};

        new Inserter(dependency, [
            'gem "websocket-client-simple"',
            'github: "matthewd/websocket-client-simple"',
            'branch: "close-race"',
            'require: false'
          ]).insert();

        expect(dependency).toStrictEqual({"name": "websocket-client-simple", "github": "matthewd/websocket-client-simple", "branch": "close-race", "require": "false"});
    });
});
