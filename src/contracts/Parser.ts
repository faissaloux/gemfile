import * as fs from 'fs';

export default abstract class AbstractParser {
    protected abstract content: {[key: string]: Array<{[key: string]: string}>};
    protected abstract originalContent: string;

    public abstract parse(): string;
    protected abstract cleanup(): void;

    public text(text: string): this {
        this.originalContent = text;

        return this;
    }

    public file(file: string): this {
        if (!fs.existsSync(file)) {
            throw new Error(`${file} doesn't exist!`);
        }

        this.originalContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });

        return this;
    }
}
