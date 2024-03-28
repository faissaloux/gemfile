import Inserter from './Inserter';
import AbstractParser from './contracts/Parser';

export default class Parser extends AbstractParser {
    protected content: {[key: string]: Array<{[key: string]: string}>} = {};
    protected originalContent: string = "";
    private root: string = "dependencies";
    private readonly COMMAS_NOT_BETWEEN_SQUARE_BRACKETS = /[,]+(?![^[]*\])/g;

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
    
    private dependencyIsDetected(line: string): boolean {
        return line.startsWith("gem ");
    }

    private parseDependency(line: string): {[key: string]: string} {

        line = line.replaceAll(this.COMMAS_NOT_BETWEEN_SQUARE_BRACKETS, "|");

        let lineArray: string[] = line.split("|");
        let dependency: {[key: string]: string} = {};
    
        lineArray = lineArray.map(elem => elem.trim());

        new Inserter(dependency, lineArray).insert();

        return dependency;
    }
}
