import * as fs from 'fs';

export default class Parser {
    readonly VERSION_SYMBOLS = [
        "<", "<=", "=", "!=", ">", ">=", "~>",
    ];
    readonly DATA = [
        "name",
        "version",
    ];
    json: string = "";
    root: string = "dependencies";
    
    dependencyIsDetected(line: string): boolean {
        return line.startsWith("gem ");
    }

    filterSupportedData(dependency: string[]): string[] {
        return dependency.filter(elem => {
            for (let record of this.DATA) {
                if (elem.includes(record)) {
                    return true;
                }
            }
        });
    }

    includeVersion(dependency: string[]): void {
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

    parseDependency(line: string): string[] {
        let dependency: string[] = line.split(",");
        let version_detected: boolean = false;

        for (let symbol of this.VERSION_SYMBOLS) {
            if (line.includes(symbol)) {
                version_detected = true;
            }
        }
    
        dependency = dependency.map(elem => elem.trim());
        dependency[0] = dependency[0].replace("gem", '"name":');

        if (version_detected) {
            this.includeVersion(dependency);
        }

        dependency = this.filterSupportedData(dependency);

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

                    let dependency = this.parseDependency(line);
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
