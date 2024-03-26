import LockParser from '../src/LockParser';

describe('lock parser', () => {

    describe('text parser', () => {
        test('parse PATH section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
PATH
    remote: .
    specs:
    actioncable (7.2.0.alpha)
        actionpack (= 7.2.0.alpha)
        activesupport (= 7.2.0.alpha)
        nio4r (~> 2.0)
        websocket-driver (>= 0.6.1)
        zeitwerk (~> 2.6)
`).parse();

            expect(parsed).toBe(`{"PATH":{"remote":".","specs":{"actioncable (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","nio4r (~> 2.0)","websocket-driver (>= 0.6.1)","zeitwerk (~> 2.6)"]}}}`);
        });

        test('parse GEM section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
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
`).parse();

            expect(parsed).toBe(`{"GEM":{"remote":"https://rubygems.org/","specs":{"addressable (2.8.6)":["public_suffix (>= 2.0.2, < 6.0)"],"amq-protocol (2.3.2)":[],"ast (2.4.2)":[],"aws-eventstream (1.3.0)":[],"aws-partitions (1.876.0)":[],"aws-sdk-core (3.190.1)":["aws-eventstream (~> 1, >= 1.3.0)","aws-partitions (~> 1, >= 1.651.0)","aws-sigv4 (~> 1.8)","jmespath (~> 1, >= 1.6.1)"]}}}`);
        });

        test('parse GIT section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
GIT
    remote: https://github.com/rails/sdoc.git
    revision: 08b4252b1f5d185890562f4106d24f3afa944e40
    branch: main
    specs:
        sdoc (3.0.0.alpha)
        nokogiri
        rdoc (>= 5.0)
        rouge
`).parse();

            expect(parsed).toBe(`{"GIT":{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":[],"nokogiri":[],"rdoc (>= 5.0)":[],"rouge":[]}}}`);
        });

        test('parse multiple sections with same name', () => {
            const parser = new LockParser();
            let parsed = parser.text(`GIT
    remote: https://github.com/matthewd/websocket-client-simple.git
    revision: e161305f1a466b9398d86df3b1731b03362da91b
    branch: close-race
    specs:
        websocket-client-simple (0.3.0)
        event_emitter
        websocket

GIT
    remote: https://github.com/rails/sdoc.git
    revision: 08b4252b1f5d185890562f4106d24f3afa944e40
    branch: main
    specs:
        sdoc (3.0.0.alpha)
        nokogiri
        rdoc (>= 5.0)
        rouge
`).parse();

            expect(parsed).toBe(`{"GIT":[{"remote":"https://github.com/matthewd/websocket-client-simple.git","revision":"e161305f1a466b9398d86df3b1731b03362da91b","branch":"close-race","specs":{"websocket-client-simple (0.3.0)":[],"event_emitter":[],"websocket":[]}},{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":[],"nokogiri":[],"rdoc (>= 5.0)":[],"rouge":[]}}]}`);
        });

        test('parse multiple sections with same name with whitespace in empty line', () => {
            const parser = new LockParser();
            let parsed = parser.text(`GIT
    remote: https://github.com/matthewd/websocket-client-simple.git
    revision: e161305f1a466b9398d86df3b1731b03362da91b
    branch: close-race
    specs:
        websocket-client-simple (0.3.0)
        event_emitter
        websocket

GIT
    remote: https://github.com/rails/sdoc.git
    revision: 08b4252b1f5d185890562f4106d24f3afa944e40
    branch: main
    specs:
        sdoc (3.0.0.alpha)
        nokogiri
        rdoc (>= 5.0)
        rouge
`).parse();

            expect(parsed).toBe(`{"GIT":[{"remote":"https://github.com/matthewd/websocket-client-simple.git","revision":"e161305f1a466b9398d86df3b1731b03362da91b","branch":"close-race","specs":{"websocket-client-simple (0.3.0)":[],"event_emitter":[],"websocket":[]}},{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":[],"nokogiri":[],"rdoc (>= 5.0)":[],"rouge":[]}}]}`);
        });

        test('parse DEPENDENCIES section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
`).parse();

            expect(parsed).toBe(`{"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });

        test('parse one PLATFORM section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
PLATFORMS
    ruby
`).parse();

            expect(parsed).toBe(`{"PLATFORMS":["ruby"]}`);
        });

        test('parse multiple PLATFORMS section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux
`).parse();

            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"]}`);
        });
  });
});
