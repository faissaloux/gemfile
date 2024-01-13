import * as fs from 'fs';

export default class LockParser {
    parse(file: string): void {
        if (!fs.existsSync(file)) {
            throw new Error(`${file} doesn't exist!`);
        }

        const fileContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });

        let object: any = {};
        let parent: string = "";
        let child: string = "";

        fileContent.split(/\r?\n/).forEach((line: string) => {
            if (!line.startsWith(" ")) {
                parent = line;
                object[parent] = [];
                child = "";
                return;
            }

            if (line.endsWith(":")) {
                child = line.replace(":", "").trim();
                object[parent][child] = [];
                object[parent][child]["indentation"] = /[a-z]/i.exec(line)?.index;
                return;
            } else if (line.includes(":")) {
                [child, line] = line.split(/:(.*)/s);
                child = child.trim();
                object[parent][child] = line.trim();
                return;
            }

            if (child != "") {
                let lineWithoutParentIndentation = line.slice(object[parent][child]["indentation"]);
                object[parent][child].push(lineWithoutParentIndentation);
            }
        });

        console.log(object);
    }
}
