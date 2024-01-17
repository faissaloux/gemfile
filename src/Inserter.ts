export default class Inserter {
    readonly VERSION_SYMBOLS: string[] = [ "<", "<=", "=", "!=", ">", ">=", "~>" ];
    readonly FIELDS: string[] = ["name", "version", "require", "github", "git", "branch"];

    private dependency: {[key: string]: string};
    private lineArray: string[];

    constructor(dependency: {[key: string]: string}, lineArray: string[]) {
        this.dependency = dependency;
        this.lineArray = lineArray;
    }

    public insert(): void {
        for (let field of this.FIELDS) {
            if (typeof this[field] === "function") {
                this[field]();
            }
        }
    }

    private name(): this {
        this.dependency["name"] = this.lineArray[0].replace("gem", "").replaceAll('"', "").trim();

        return this;
    }

    private version(): this {
        let versions: string[] = [];

        for (let elem of this.lineArray) {
            let hasDigit = elem.match(/\d/);

            if (!elem.includes(" ") && hasDigit && hasDigit["index"]) {
                elem = elem.slice(0, hasDigit["index"]) + " " + elem.slice(hasDigit["index"]);
            }

            for (let symbol of this.VERSION_SYMBOLS) {
                if (elem.includes("\"" + symbol + " ")) {
                    versions.push(elem.replaceAll('"', ''));
                }
            }
        }

        if (versions.length) {
            this.dependency["version"] = versions.join(", ");
        }

        return this;
    }

    private require(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("require: ")) {
                this.dependency["require"] = elem.replace("require: ", "");
            }
        }

        return this;
    }

    private github(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("github: ")) {
                this.dependency["github"] = elem.replace("github: ", "").replaceAll("\"", "");
            }
        }

        return this;
    }

    private git(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("git: ")) {
                this.dependency["git"] = elem.replace("git: ", "").replaceAll("\"", "");
            }
        }

        return this;
    }

    private branch(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("branch: ")) {
                this.dependency["branch"] = elem.replace("branch: ", "").replaceAll("\"", "");
            }
        }

        return this;
    }
}
