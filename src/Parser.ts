import * as fs from 'fs';

export default class Parser {
    readonly VERSION_SYMBOLS = [
        "<", "<=", "=", "!=", ">", ">=", "~>",
    ];
    json: string = "";
    root: string = "dependencies";
    
    dependencyIsDetected(line: string): boolean {
        return line.startsWith("gem ");
    }

    parseLine(line: string): string[] {
        let dependency: string[] = line.split(",");
        let version_detected: boolean = false;

        for (let symbol of this.VERSION_SYMBOLS) {
            if (line.includes(symbol)) {
                version_detected = true;
            }
        }
    
        dependency = dependency.map(elem => elem.trim());
        dependency[0] = dependency[0].replace("gem", '"name":');
        dependency = dependency.filter(elem => !elem.includes("platforms"));

        if (version_detected) {
            let versions: string[] = [];
            let versionsIndexes: number[] = [];

            for (let [index, elem] of dependency.entries()) {
                let hasDigit = elem.match(/\d/);

                if (!elem.includes(" ") && hasDigit && hasDigit["index"]) {
                    elem = elem.slice(0, hasDigit["index"]) + " " + elem.slice(hasDigit["index"]);
                }

                for (let symbol of this.VERSION_SYMBOLS) {
                    if (elem.includes("\"" + symbol + " ")) {
                        versions.push(elem.replaceAll('"', ''));
                        versionsIndexes.push(index);
                    }
                }
            }

            dependency.splice(versionsIndexes[0], versionsIndexes.length);

            dependency.push(`"version": "${versions.join(", ")}"`);
        }

        return dependency;
    }

    parse(file: string) {
        fs.readFile(file, 'utf8', (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`${file} doesn't exist!`);
    
                    return;
                }
            
                throw err;
            }

            let first: boolean = true;
            this.json += `{"${this.root}": [`;

            content.split(/\r?\n/).forEach((line: string) => {    
                line = line.trim();

                if (this.dependencyIsDetected(line)) {
                    if (!first) {
                        this.json += ",";
                    }

                    let dependency = this.parseLine(line);
                    this.json += "{" + dependency + "}";

                    if (first) {
                        first = false;
                    }
                }
            });
    
            this.json += "]}";
    
            console.log( JSON.parse(this.json) );
        });
    }
}
