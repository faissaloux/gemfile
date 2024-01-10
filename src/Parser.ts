import * as fs from 'fs';

export default class Parser {
    readonly VERSION_SYMBOLS = [ "<", "<=", "=", "!=", ">", ">=", "~>" ];
    content: {[key: string]: Array<{[key: string]: string}>} = {};
    root: string = "dependencies";
    
    dependencyIsDetected(line: string): boolean {
        return line.startsWith("gem ");
    }

    includeName(dependency: {[key: string]: string}, lineArray: string[]): void {
        dependency["name"] = lineArray[0].replace("gem", "").replaceAll('"', "").trim();
    }

    includeVersion(dependency: {[key: string]: string}, lineArray: string[]): void {
        let versions: string[] = [];
        let versionsIndexes: number[] = [];

        for (let [index, elem] of lineArray.entries()) {
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

        dependency["version"] = versions.join(", ");
    }

    parseDependency(line: string): {[key: string]: string} {
        let lineArray: string[] = line.split(",");
        let dependency: {[key: string]: string} = {};
        let version_detected: boolean = false;

        for (let symbol of this.VERSION_SYMBOLS) {
            if (line.includes(symbol)) {
                version_detected = true;
            }
        }
    
        lineArray = lineArray.map(elem => elem.trim());

        this.includeName(dependency, lineArray);

        if (version_detected) {
            this.includeVersion(dependency, lineArray);
        }

        return dependency;
    }

    parse(file: string): string {
        if (!fs.existsSync(file)) {
            throw new Error(`${file} doesn't exist!`);
        }

        const fileContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });

        let dependencies: Array<{[key: string]: string}> = [];

        fileContent.split(/\r?\n/).forEach((line: string) => {
            line = line.trim();

            if (this.dependencyIsDetected(line)) {
                let dependency = this.parseDependency(line);
                dependencies.push(dependency);
            }
        });

        this.content[this.root] = dependencies;

        return JSON.stringify(this.content);
    }
}
