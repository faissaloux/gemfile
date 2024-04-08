import Version from '../../src/elements/Version';

describe('version element', () => {
    test('symbols', () => {
        expect(Version.VERSION_SYMBOLS).toStrictEqual([ "<", "<=", "=", "!=", ">", ">=", "~>" ]);
    });
});
