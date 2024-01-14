import * as fs from 'fs';
import * as util from 'util';

export default class LockParser {
    parse(file: string): void {
        if (!fs.existsSync(file)) {
            throw new Error(`${file} doesn't exist!`);
        }

        const fileContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
        const lines = fileContent.split(/\r?\n/);

        let object: any = {};
        let parent: string = "";
        let section: string = "";
        let sectionParent: string = "";
        let lastIndentation: number = 0;

        lines.forEach((line: string, index: number) => {
            if (!line.startsWith(" ")) {
                parent = line;
                object[parent] = [];
                section = "";
                return;
            }

            if (line.endsWith(":")) {
                section = line.replace(":", "").trim();
                object[parent][section] = [];
                object[parent][section]["indentation"] = /[a-z]/i.exec(line)?.index;
                return;
            }

            if (line.includes(":")) {
                [section, line] = line.split(/:(.*)/s);
                section = section.trim();
                object[parent][section] = line.trim();
                return;
            }

            if (section != "") {
                let lineWithoutParentIndentation: string = line.slice(object[parent][section]["indentation"]);
                let firstCharIndex: number = /[a-z]/i.exec(lineWithoutParentIndentation)?.index || 0;

                if (lastIndentation == 0 || firstCharIndex <= lastIndentation) {
                    if (object[parent][section][sectionParent] && firstCharIndex > object[parent][section][sectionParent]["indentation"]) {
                        object[parent][section][sectionParent].push(line.trim());
                    } else {
                        sectionParent = lineWithoutParentIndentation.slice(firstCharIndex);
                        object[parent][section][sectionParent] = [];
                        object[parent][section][sectionParent]["indentation"] = firstCharIndex;
                    }
                } else if (firstCharIndex > lastIndentation || object[parent][section][sectionParent].length > 0) {
                    object[parent][section][sectionParent].push(line.trim());
                }

                lastIndentation = firstCharIndex;
            }
        });

        console.log(util.inspect(object, true, 10));
    }
}
