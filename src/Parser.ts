import * as fs from 'fs';
import Inserter from './Inserter';
import AbstractParser from './contracts/Parser';

export default class Parser extends AbstractParser {
    protected content: {[key: string]: Array<{[key: string]: string}>} = {};
    protected originalContent: string = "";
    private root: string = "dependencies";
    
    private dependencyIsDetected(line: string): boolean {
        return line.startsWith("gem ");
    }

    private parseDependency(line: string): {[key: string]: string} {
        let lineArray: string[] = line.split(",");
        let dependency: {[key: string]: string} = {};
    
        lineArray = lineArray.map(elem => elem.trim());

        new Inserter(dependency, lineArray).insert();

        return dependency;
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
        let dependencies: Array<{[key: string]: string}> = [];

        lines.forEach((line: string) => {
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
