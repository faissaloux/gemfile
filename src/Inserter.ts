export default class Inserter {
    readonly VERSION_SYMBOLS = [ "<", "<=", "=", "!=", ">", ">=", "~>" ];

    dependency: {[key: string]: string};
    lineArray: string[];

    constructor(dependency: {[key: string]: string}, lineArray: string[]) {
        this.dependency = dependency;
        this.lineArray = lineArray;
    }

    name(): this {
        this.dependency["name"] = this.lineArray[0].replace("gem", "").replaceAll('"', "").trim();

        return this;
    }

    version(): this {
        let versions: string[] = [];
        let versionsIndexes: number[] = [];

        for (let [index, elem] of this.lineArray.entries()) {
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

        if (versions.length) {
            this.dependency["version"] = versions.join(", ");
        }

        return this;
    }
}
