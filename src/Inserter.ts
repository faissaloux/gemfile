export default class Inserter {
    readonly VERSION_SYMBOLS: string[] = [ "<", "<=", "=", "!=", ">", ">=", "~>" ];
    readonly FIELDS: string[] = ["name", "version", "require", "github", "branch"];

    dependency: {[key: string]: string};
    lineArray: string[];

    constructor(dependency: {[key: string]: string}, lineArray: string[]) {
        this.dependency = dependency;
        this.lineArray = lineArray;
    }

    insert(): void {
        for (let field of this.FIELDS) {
            if (typeof this[field] === "function") {
                this[field]();
            }
        }
    }

    name(): this {
        this.dependency["name"] = this.lineArray[0].replace("gem", "").replaceAll('"', "").trim();

        return this;
    }

    version(): this {
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

    require(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("require: ")) {
                this.dependency["require"] = elem.replace("require: ", "");
            }
        }

        return this;
    }

    github(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("github: ")) {
                this.dependency["github"] = elem.replace("github: ", "").replaceAll("\"", "");
            }
        }

        return this;
    }

    branch(): this {
        for (let elem of this.lineArray) {
            if (elem.includes("branch: ")) {
                this.dependency["branch"] = elem.replace("branch: ", "").replaceAll("\"", "");
            }
        }

        return this;
    }
}
