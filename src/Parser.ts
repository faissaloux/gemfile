import * as fs from 'fs';
import Inserter from './Inserter';

export default class Parser {
    private content: {[key: string]: Array<{[key: string]: string}>} = {};
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

    public parse(file: string): string {
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
