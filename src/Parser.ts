import Version from './elements/Version';
import Inserter from './Inserter';
import AbstractParser from './contracts/Parser';

export default class Parser extends AbstractParser {
    protected content: {[key: string]: Array<{[key: string]: string}>} = {};
    protected originalContent: string = "";
    private root: string = "dependencies";
    private readonly COMMAS_NOT_BETWEEN_SQUARE_BRACKETS = /[,]+(?![^[]*\])/g;
    private static filter: string[] = ["gem", "version", "require", "github", "git", "branch", "platforms"];
    private static filterMode: string = "default";

    constructor() {
        super();
        Parser.filterMode = "default";
    }

    public static only(...elements: string[]) {
        if (Parser.filterMode === "default") {
            Parser.filter = [];
            Parser.filterMode = "only";
        }

        elements = elements.map(element => {
            if (element === "name") {
                element = "gem";
            }

            return element;
        });

        Parser.filter = [...new Set(Parser.filter.concat(elements))];
    }

    public parse(): string {
        const lines = this.originalContent.split(/\r?\n/);
        let dependencies: Array<{[key: string]: string}> = [];

        lines.forEach((line: string) => {
            line = line.trim();

            if (this.dependencyIsDetected(line)) {
                let dependency = this.parseDependency(line);
                if (Object.keys(dependency).length > 0) {
                    dependencies.push(dependency);
                }
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

        lineArray = lineArray.filter(function(elem) {
            for (let symbol of Version.VERSION_SYMBOLS) {
                if (elem.replace(/^\s"+/, '').startsWith(symbol)) {
                    return true;
                }
            }

            for(let elemToReturn of Parser.filter) {
                if(elem.trim().startsWith(elemToReturn)) {
                    return true;
                }
            }

            return false;
        });

        lineArray = lineArray.map(elem => elem.trim());

        if (lineArray.length > 0) {
            new Inserter(dependency, lineArray).only(Parser.filter).insert();
        }

        return dependency;
    }
}
