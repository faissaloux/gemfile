import * as fs from 'fs';
import AbstractParser from './contracts/Parser';

export default class LockParser extends AbstractParser {
    protected content: {[key: string]: any} = {};
    protected originalContent: string = "";

    private removePrivateKeys(object: any) {
        Object.keys(object).forEach((key: any) => {
            if (typeof object[key] === 'object') {
                this.removePrivateKeys(object[key]);
            } else if (key.startsWith("_")) {
                delete object[key];
            }
        });
    }

    private cleanup() {
        this.removePrivateKeys(this.content);
    }

    public file(file: string): this {
        if (!fs.existsSync(file)) {
            throw new Error(`${file} doesn't exist!`);
        }

        this.originalContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });

        return this;
    }

    public text(text: string): this {
        this.originalContent = text;

        return this;
    }

    public parse(): string {
        const lines = this.originalContent.split(/\r?\n/);

        let parent: string = "";
        let section: string = "";
        let sectionParent: string = "";
        let lastIndentation: number = 0;

        lines.forEach((line: string) => {
            if (!line.startsWith(" ")) {
                if (line.length) {
                    parent = line;

                    if (["PLATFORMS", "DEPENDENCIES"].includes(parent)) {
                        this.content[parent] = [];
                    } else {
                        this.content[parent] = {};
                    }

                    section = "";
                }

                return;
            }

            if (line.endsWith(":")) {
                section = line.replace(":", "").trim();
                this.content[parent][section] = {};
                this.content[parent][section]["_indentation"] = /[a-z]/i.exec(line)?.index;
                return;
            }

            if (line.includes(":")) {
                [section, line] = line.split(/:(.*)/s);
                section = section.trim();
                this.content[parent][section] = line.trim();
                return;
            }

            if (section === "") {
                console.log(parent);
                this.content[parent].push(line.trim());
            }

            if (section != "") {
                let lineWithoutParentIndentation: string = line.slice(this.content[parent][section]["_indentation"]);
                let firstCharIndex: number = /[a-z]/i.exec(lineWithoutParentIndentation)?.index || 0;

                if (lastIndentation == 0 || firstCharIndex <= lastIndentation) {
                    if (this.content[parent][section][sectionParent] && firstCharIndex > this.content[parent][section][sectionParent]["_indentation"]) {
                        this.content[parent][section][sectionParent].push(line.trim());
                    } else {
                        sectionParent = lineWithoutParentIndentation.slice(firstCharIndex);
                        this.content[parent][section][sectionParent] = [];
                        this.content[parent][section][sectionParent]["_indentation"] = firstCharIndex;
                    }
                } else if (firstCharIndex > lastIndentation || this.content[parent][section][sectionParent].length > 0) {
                    this.content[parent][section][sectionParent].push(line.trim());
                }

                lastIndentation = firstCharIndex;
            }
        });

        this.cleanup();

        return JSON.stringify(this.content);
    }
}
