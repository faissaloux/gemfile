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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"GIT":[{"remote":"https://github.com/matthewd/websocket-client-simple.git","revision":"e161305f1a466b9398d86df3b1731b03362da91b","branch":"close-race","specs":{"websocket-client-simple (0.3.0)":[],"event_emitter":[],"websocket":[]}},{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":[],"nokogiri":[],"rdoc (>= 5.0)":[],"rouge":[]}}]}`);
        });

        test('parse multiple sections with same name with whitespace in empty line', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
GIT
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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"GIT":[{"remote":"https://github.com/matthewd/websocket-client-simple.git","revision":"e161305f1a466b9398d86df3b1731b03362da91b","branch":"close-race","specs":{"websocket-client-simple (0.3.0)":[],"event_emitter":[],"websocket":[]}},{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":[],"nokogiri":[],"rdoc (>= 5.0)":[],"rouge":[]}}]}`);
        });

        test('parse DEPENDENCIES section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });

        test('parse one PLATFORM section', () => {
            const parser = new LockParser();
            let parsed = parser.text(`
PLATFORMS
    ruby
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"]}`);
        });

        test('parse all in', () => {
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

GIT
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

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PATH":{"remote":".","specs":{"actioncable (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","nio4r (~> 2.0)","websocket-driver (>= 0.6.1)","zeitwerk (~> 2.6)"]}},"GIT":[{"remote":"https://github.com/matthewd/websocket-client-simple.git","revision":"e161305f1a466b9398d86df3b1731b03362da91b","branch":"close-race","specs":{"websocket-client-simple (0.3.0)":[],"event_emitter":[],"websocket":[]}},{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":[],"nokogiri":[],"rdoc (>= 5.0)":[],"rouge":[]}}],"GEM":{"remote":"https://rubygems.org/","specs":{"addressable (2.8.6)":["public_suffix (>= 2.0.2, < 6.0)"],"amq-protocol (2.3.2)":[],"ast (2.4.2)":[],"aws-eventstream (1.3.0)":[],"aws-partitions (1.876.0)":[],"aws-sdk-core (3.190.1)":["aws-eventstream (~> 1, >= 1.3.0)","aws-partitions (~> 1, >= 1.651.0)","aws-sigv4 (~> 1.8)","jmespath (~> 1, >= 1.6.1)"]}},"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });
  });

    describe('file parser', () => {
        const parser = new LockParser();

        test('unexisted file', () => {
            expect(() => parser.file('tests/files/unexisted').parse()).toThrow(Error);
        });

        test('parse', () => {
            let parsed = parser.file('tests/files/Gemfile.lock').parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"GIT":[{"remote":"https://github.com/matthewd/websocket-client-simple.git","revision":"e161305f1a466b9398d86df3b1731b03362da91b","branch":"close-race","specs":{"websocket-client-simple (0.3.0)":["event_emitter","websocket"]}},{"remote":"https://github.com/rails/sdoc.git","revision":"08b4252b1f5d185890562f4106d24f3afa944e40","branch":"main","specs":{"sdoc (3.0.0.alpha)":["nokogiri","rdoc (>= 5.0)","rouge"]}}],"PATH":{"remote":".","specs":{"actioncable (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","nio4r (~> 2.0)","websocket-driver (>= 0.6.1)","zeitwerk (~> 2.6)"],"actionmailbox (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activejob (= 7.2.0.alpha)","activerecord (= 7.2.0.alpha)","activestorage (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","mail (>= 2.8.0)"],"actionmailer (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","actionview (= 7.2.0.alpha)","activejob (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","mail (>= 2.8.0)","rails-dom-testing (~> 2.2)"],"actionpack (7.2.0.alpha)":["actionview (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","nokogiri (>= 1.8.5)","racc","rack (>= 2.2.4)","rack-session (>= 1.0.1)","rack-test (>= 0.6.3)","rails-dom-testing (~> 2.2)","rails-html-sanitizer (~> 1.6)","useragent (~> 0.16)"],"actiontext (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activerecord (= 7.2.0.alpha)","activestorage (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","globalid (>= 0.6.0)","nokogiri (>= 1.8.5)"],"actionview (7.2.0.alpha)":["activesupport (= 7.2.0.alpha)","builder (~> 3.1)","erubi (~> 1.11)","rails-dom-testing (~> 2.2)","rails-html-sanitizer (~> 1.6)"],"activejob (7.2.0.alpha)":["activesupport (= 7.2.0.alpha)","globalid (>= 0.3.6)"],"activemodel (7.2.0.alpha)":["activesupport (= 7.2.0.alpha)"],"activerecord (7.2.0.alpha)":["activemodel (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","timeout (>= 0.4.0)"],"activestorage (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activejob (= 7.2.0.alpha)","activerecord (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","marcel (~> 1.0)"],"activesupport (7.2.0.alpha)":["base64","bigdecimal","concurrent-ruby (~> 1.0, >= 1.0.2)","connection_pool (>= 2.2.5)","drb","i18n (>= 1.6, < 2)","minitest (>= 5.1)","tzinfo (~> 2.0, >= 2.0.5)"],"rails (7.2.0.alpha)":["actioncable (= 7.2.0.alpha)","actionmailbox (= 7.2.0.alpha)","actionmailer (= 7.2.0.alpha)","actionpack (= 7.2.0.alpha)","actiontext (= 7.2.0.alpha)","actionview (= 7.2.0.alpha)","activejob (= 7.2.0.alpha)","activemodel (= 7.2.0.alpha)","activerecord (= 7.2.0.alpha)","activestorage (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","bundler (>= 1.15.0)","railties (= 7.2.0.alpha)"],"railties (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","irb","rackup (>= 1.0.0)","rake (>= 12.2)","thor (~> 1.0, >= 1.2.2)","zeitwerk (~> 2.6)"]}},"GEM":{"remote":"https://rubygems.org/","specs":{"addressable (2.8.6)":["public_suffix (>= 2.0.2, < 6.0)"],"amq-protocol (2.3.2)":[],"ast (2.4.2)":[],"aws-eventstream (1.3.0)":[],"aws-partitions (1.876.0)":[],"importmap-rails (1.2.3)":["actionpack (>= 6.0.0)","activesupport (>= 6.0.0)","railties (>= 6.0.0)"],"io-console (0.7.1)":[],"irb (1.11.0)":["rdoc","reline (>= 0.3.8)"],"jbuilder (2.11.5)":["actionview (>= 5.0.0)","activesupport (>= 5.0.0)"],"jmespath (1.6.2)":[],"jsbundling-rails (1.2.1)":["railties (>= 6.0.0)"],"json (2.7.1)":[],"jwt (2.7.1)":[],"kramdown (2.4.0)":["rexml"],"kramdown-parser-gfm (1.1.0)":["kramdown (~> 2.0)"],"kredis (1.7.0)":["activemodel (>= 6.0.0)","activesupport (>= 6.0.0)","redis (>= 4.2, < 6)"],"language_server-protocol (3.17.0.3)":[],"libxml-ruby (5.0.0)":[],"listen (3.8.0)":["rb-fsevent (~> 0.10, >= 0.10.3)","rb-inotify (~> 0.9, >= 0.9.10)"],"loofah (2.22.0)":["crass (~> 1.0.2)","nokogiri (>= 1.12.0)"],"mail (2.8.1)":["mini_mime (>= 0.1.1)","net-imap","net-pop","net-smtp"],"marcel (1.0.2)":[],"matrix (0.4.2)":[],"mdl (0.12.0)":["kramdown (~> 2.3)","kramdown-parser-gfm (~> 1.1)","mixlib-cli (~> 2.1, >= 2.1.1)","mixlib-config (>= 2.2.1, < 4)","mixlib-shellout"],"mini_magick (4.12.0)":[],"mini_mime (1.1.5)":[],"mini_portile2 (2.8.5)":[],"minitest (5.21.1)":[],"minitest-bisect (1.7.0)":["minitest-server (~> 1.0)","path_expander (~> 1.1)"],"minitest-ci (3.4.0)":["minitest (>= 5.0.6)"],"minitest-retry (0.2.2)":["minitest (>= 5.0)"],"minitest-server (1.0.7)":["minitest (~> 5.16)"],"mixlib-cli (2.1.8)":[],"mixlib-config (3.0.27)":["tomlrb"],"mixlib-shellout (3.2.7)":["chef-utils"],"mono_logger (1.1.2)":[],"msgpack (1.7.2)":[],"multi_json (1.15.0)":[],"multipart-post (2.3.0)":[],"mysql2 (0.5.5)":[],"net-http-persistent (4.0.2)":["connection_pool (~> 2.2)"],"net-imap (0.4.9)":["date","net-protocol"],"net-pop (0.1.2)":["net-protocol"],"net-protocol (0.2.2)":["timeout"],"net-smtp (0.4.0)":["net-protocol"],"nio4r (2.7.0)":[],"nokogiri (1.16.0)":["mini_portile2 (~> 2.8.2)","racc (~> 1.4)"],"nokogiri (1.16.0-x86_64-darwin)":["racc (~> 1.4)"],"nokogiri (1.16.0-x86_64-linux)":["racc (~> 1.4)"],"os (1.1.4)":[],"parallel (1.24.0)":[],"parser (3.2.2.4)":["ast (~> 2.4.1)","racc"],"path_expander (1.1.1)":[],"pg (1.5.4)":[],"prettier_print (1.2.1)":[],"propshaft (0.8.0)":["actionpack (>= 7.0.0)","activesupport (>= 7.0.0)","rack","railties (>= 7.0.0)"],"psych (5.1.2)":["stringio"],"public_suffix (5.0.4)":[],"puma (6.4.0)":["nio4r (~> 2.0)"],"queue_classic (4.0.0)":["pg (>= 1.1, < 2.0)"],"raabro (1.4.0)":[],"racc (1.7.3)":[],"rack (3.0.8)":[],"rack-cache (1.15.0)":["rack (>= 0.4)"],"xpath (1.15.0)":["rack (>= 0.4)"]}},"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","activerecord-jdbcpostgresql-adapter (>= 1.3.0)","activerecord-jdbcsqlite3-adapter (>= 1.3.0)","aws-sdk-s3","aws-sdk-sns","azure-storage-blob (~> 2.0)","backburner","bcrypt (~> 3.1.11)","benchmark-ips","bootsnap (>= 1.4.4)","brakeman","capybara (>= 3.39)","cgi (>= 0.3.6)","connection_pool","cssbundling-rails","dalli (>= 3.0.1)","dartsass-rails","debug (>= 1.1.0)","delayed_job","delayed_job_active_record","google-cloud-storage (~> 1.11)","image_processing (~> 1.2)","importmap-rails (>= 1.2.3)","jbuilder","jsbundling-rails","json (>= 2.0.0, != 2.7.0)","kredis (>= 1.7.0)","libxml-ruby","listen (~> 3.3)","mdl (!= 0.13.0)","minitest (>= 5.15.0)","minitest-bisect","minitest-ci","minitest-retry","msgpack (>= 1.7.0)","mysql2 (~> 0.5)","nokogiri (>= 1.8.1, != 1.11.0)","pg (~> 1.3)","propshaft (>= 0.1.7)","puma (>= 5.0.3)","queue_classic (>= 4.0.0)","racc (>= 1.4.6)","rack (~> 3.0)","rack-cache (~> 1.2)","rails!","rake (>= 13)","rdoc (~> 6.5)","redcarpet (~> 3.2.3)","redis (>= 4.0.1)","redis-namespace","resque","resque-scheduler","rexml","rouge","rubocop (>= 1.25.1)","rubocop-md","rubocop-minitest","rubocop-packaging","rubocop-performance","rubocop-rails","rubocop-rails-omakase","rubyzip (~> 2.0)","sdoc!","selenium-webdriver (>= 4.11.0)","sidekiq","sneakers","sprockets-rails (>= 2.0.0)","sqlite3 (~> 1.6, >= 1.6.6)","stackprof","stimulus-rails","sucker_punch","syntax_tree (= 6.1.1)","tailwindcss-rails","terser (>= 1.1.4)","trilogy (>= 2.5.0)","turbo-rails","tzinfo-data","useragent","w3c_validators (~> 1.3.6)","wdm (>= 0.1.0)","web-console","webmock","webrick","websocket-client-simple!"],"BUNDLED WITH":"2.5.4"}`);
        });
    });

    describe('only', () => {
        test('parse one section specifying one existing section to return', () => {
          const parser = new LockParser();
          LockParser.only("PATH");
    
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
    
          expect(() => JSON.parse(parsed)).not.toThrow(Error);
          expect(parsed).toBe(`{"PATH":{"remote":".","specs":{"actioncable (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","nio4r (~> 2.0)","websocket-driver (>= 0.6.1)","zeitwerk (~> 2.6)"]}}}`);
        });

        test('parse two sections specifying one existing section to return', () => {
            const parser = new LockParser();
            LockParser.only("PATH");
      
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

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
  `).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PATH":{"remote":".","specs":{"actioncable (7.2.0.alpha)":["actionpack (= 7.2.0.alpha)","activesupport (= 7.2.0.alpha)","nio4r (~> 2.0)","websocket-driver (>= 0.6.1)","zeitwerk (~> 2.6)"]}}}`);
        });

        test('parse multiple sections specifying one existing section to return', () => {
            const parser = new LockParser();
            LockParser.only("DEPENDENCIES");
      
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

PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });

        test('parse multiple sections specifying multiple existing sections to return', () => {
            const parser = new LockParser();
            LockParser.only("PLATFORMS");
            LockParser.only("DEPENDENCIES");
      
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

PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });

        test('parse multiple sections specifying multiple existing sections (duplicated) to return', () => {
            const parser = new LockParser();
            LockParser.only("PLATFORMS");
            LockParser.only("DEPENDENCIES");
            LockParser.only("PLATFORMS");
      
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

PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });

        test('parse multiple sections specifying multiple existing sections to return in one line', () => {
            const parser = new LockParser();
            LockParser.only("PLATFORMS", "DEPENDENCIES");
      
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

PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"]}`);
        });

        test('parse multiple sections specifying multiple existing sections to return mixed', () => {
            const parser = new LockParser();
            LockParser.only("PLATFORMS", "DEPENDENCIES");
            LockParser.only("BUNDLED WITH");
      
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

PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3

BUNDLED WITH
    2.5.4
`).parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"],"BUNDLED WITH":"2.5.4"}`);
        });

        test('filter before LockParser initiation', () => {
            LockParser.only("PLATFORMS", "DEPENDENCIES");
            LockParser.only("BUNDLED WITH");
            
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

PLATFORMS
    ruby
    x86_64-darwin
    x86_64-linux

DEPENDENCIES
    activerecord-jdbcmysql-adapter (>= 1.3.0)
    aws-sdk-s3

BUNDLED WITH
    2.5.4
`).parse();
    
            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"PLATFORMS":["ruby","x86_64-darwin","x86_64-linux"],"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","aws-sdk-s3"],"BUNDLED WITH":"2.5.4"}`);
        });

        test('parse file with filter sections', () => {
            LockParser.only("DEPENDENCIES");

            const parser = new LockParser();
            let parsed = parser.file('tests/files/Gemfile.lock').parse();

            expect(() => JSON.parse(parsed)).not.toThrow(Error);
            expect(parsed).toBe(`{"DEPENDENCIES":["activerecord-jdbcmysql-adapter (>= 1.3.0)","activerecord-jdbcpostgresql-adapter (>= 1.3.0)","activerecord-jdbcsqlite3-adapter (>= 1.3.0)","aws-sdk-s3","aws-sdk-sns","azure-storage-blob (~> 2.0)","backburner","bcrypt (~> 3.1.11)","benchmark-ips","bootsnap (>= 1.4.4)","brakeman","capybara (>= 3.39)","cgi (>= 0.3.6)","connection_pool","cssbundling-rails","dalli (>= 3.0.1)","dartsass-rails","debug (>= 1.1.0)","delayed_job","delayed_job_active_record","google-cloud-storage (~> 1.11)","image_processing (~> 1.2)","importmap-rails (>= 1.2.3)","jbuilder","jsbundling-rails","json (>= 2.0.0, != 2.7.0)","kredis (>= 1.7.0)","libxml-ruby","listen (~> 3.3)","mdl (!= 0.13.0)","minitest (>= 5.15.0)","minitest-bisect","minitest-ci","minitest-retry","msgpack (>= 1.7.0)","mysql2 (~> 0.5)","nokogiri (>= 1.8.1, != 1.11.0)","pg (~> 1.3)","propshaft (>= 0.1.7)","puma (>= 5.0.3)","queue_classic (>= 4.0.0)","racc (>= 1.4.6)","rack (~> 3.0)","rack-cache (~> 1.2)","rails!","rake (>= 13)","rdoc (~> 6.5)","redcarpet (~> 3.2.3)","redis (>= 4.0.1)","redis-namespace","resque","resque-scheduler","rexml","rouge","rubocop (>= 1.25.1)","rubocop-md","rubocop-minitest","rubocop-packaging","rubocop-performance","rubocop-rails","rubocop-rails-omakase","rubyzip (~> 2.0)","sdoc!","selenium-webdriver (>= 4.11.0)","sidekiq","sneakers","sprockets-rails (>= 2.0.0)","sqlite3 (~> 1.6, >= 1.6.6)","stackprof","stimulus-rails","sucker_punch","syntax_tree (= 6.1.1)","tailwindcss-rails","terser (>= 1.1.4)","trilogy (>= 2.5.0)","turbo-rails","tzinfo-data","useragent","w3c_validators (~> 1.3.6)","wdm (>= 0.1.0)","web-console","webmock","webrick","websocket-client-simple!"]}`);
        });
    });
});
