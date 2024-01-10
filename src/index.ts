import * as fs from 'fs';

const VERSION_SYMBOLS = [
    ">", ">=", "<", "<=", "=", "!=", "~>",
];

export function parse(file: string) {
    let json: string = "";

    fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`${file} doesn't exist!`);

                return;
            }
        
            throw err;
        }

        let first: boolean = true;
        json += '{"dependencies": [';

        content.split(/\r?\n/).forEach((line: string) => {
            let version_detected: boolean = false;

            line = line.trim();
            for (let symbol of VERSION_SYMBOLS) {
                if (line.includes(symbol)) {
                    version_detected = true;
                }
            }

            if (line.startsWith("gem ")) {
                if (!first) {
                    json += ",";
                }

                let dependency: string[] = line.split(",");

                dependency = dependency.map(elem => elem.trim());
                dependency[0] = dependency[0].replace("gem", '"name":');
                dependency = dependency.filter(elem => !elem.includes("platforms"));

                if (version_detected) {
                    let versions: string[] = [];
                    let versionsIndexes: number[] = [];

                    dependency.forEach(function(elem, index) {
                        let hasDigit = elem.match(/\d/);

                        if (!elem.includes(" ") && hasDigit && hasDigit["index"]){
                            elem = elem.slice(0, hasDigit["index"]) + " " + elem.slice(hasDigit["index"]);
                        }

                        for (let symbol of VERSION_SYMBOLS) {
                            if (elem.includes("\"" + symbol + " ")) {
                                versions.push(elem.replaceAll('"', ''));
                                versionsIndexes.push(index);
                            }
                        }
                    });

                    dependency.splice(versionsIndexes[0], versionsIndexes.length);

                    dependency.push(`"version": "${versions.join(", ")}"`);
                }

                json += "{" + dependency + "}";
                if (first) {
                    first = false;
                }
            }
        });

        json += "]}";

        console.log( JSON.parse(json) );
    });
}
