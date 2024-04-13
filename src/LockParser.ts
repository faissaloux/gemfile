import AbstractParser from './contracts/Parser';

export default class LockParser extends AbstractParser {
    protected content: {[key: string]: any} = {};
    protected originalContent: string = "";
    private sectionLocked: boolean = false;
    private bloc: {[key: string]: any} = {};
    private static filter: string[] = ["PATH", "GEM", "GIT", "PLATFORMS", "DEPENDENCIES", "BUNDLED WITH"];
    private static filterMode: string = "default";

    public static only(...elements: string[]) {
        if (LockParser.filterMode === "default") {
            LockParser.filter = [];
            LockParser.filterMode = "only";
        }

        LockParser.filter = [...new Set(LockParser.filter.concat(elements))];
    }

    public parse(): string {
        const lines = this.originalContent.split(/\r?\n/);

        let parent: string = "";
        let section: string = "";
        let sectionParent: string = "";
        let lastIndentation: number = 0;

        lines.forEach((line: string) => {
            if (line.startsWith(" ") && this.sectionLocked) {
                return;
            }

            this.sectionLocked = false;

            if (line.trim() === "") {
                if (Object.keys(this.bloc).length !== 0) {
                    this.content[parent].push(this.bloc);
                    this.bloc = {};
                }
            }

            if (!line.startsWith(" ")) {
                if (line.length) {
                    if (!LockParser.filter.includes(line)) {
                        this.sectionLocked = true;
                        return;
                    }

                    parent = line;
                    if (! this.content.hasOwnProperty(parent)) {
                        this.content[parent] = [];
                    }

                    section = "";
                }

                return;
            }

            if (line.endsWith(":")) {
                section = line.replace(":", "").trim();
                this.bloc[section] = {};
                this.bloc[section]["_indentation"] = /[a-z]/i.exec(line)?.index;
                return;
            }

            if (line.includes(":")) {
                [section, line] = line.split(/:(.*)/s);
                section = section.trim();
                this.bloc[section] = line.trim();
                return;
            }

            if (section === "") {
                this.content[parent].push(line.trim());

                return;
            }

            if (line.trim() !== "") {
                let lineWithoutParentIndentation: string = line.slice(this.bloc[section]["_indentation"]);
                let firstCharIndex: number = /[a-z]/i.exec(lineWithoutParentIndentation)?.index || 0;

                if (lastIndentation === 0 || firstCharIndex <= lastIndentation) {
                    if (this.bloc[section][sectionParent] && firstCharIndex > this.bloc[section][sectionParent]["_indentation"]) {
                        this.bloc[section][sectionParent].push(line.trim());
                    } else {
                        sectionParent = lineWithoutParentIndentation.slice(firstCharIndex);
                        this.bloc[section][sectionParent] = [];
                        this.bloc[section][sectionParent]["_indentation"] = firstCharIndex;
                    }
                } else if (firstCharIndex > lastIndentation || this.bloc[section][sectionParent].length > 0) {
                    this.bloc[section][sectionParent].push(line.trim());
                }
    
                lastIndentation = firstCharIndex;
            }
        });

        this.cleanup();

        return JSON.stringify(this.content);
    }

    private removePrivateKeys(object: any) {
        Object.keys(object).forEach((key: any) => {
            if (typeof object[key] === 'object') {
                this.removePrivateKeys(object[key]);
            } else if (key.startsWith("_")) {
                delete object[key];
            }
        });
    }

    private simplifyStructure() {
        const ignore: string[] = ["PLATFORMS"];

        Object.keys(this.content).forEach((key: string) => {
            if (!ignore.includes(key) && this.content[key].length === 1) {
                this.content[key] = this.content[key][0];
            }
        });
    }

    protected cleanup(): void {
        this.removePrivateKeys(this.content);
        this.simplifyStructure();
        LockParser.filterMode = "default";
    }
}
