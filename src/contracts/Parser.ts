export default abstract class AbstractParser {
    protected abstract content: {[key: string]: Array<{[key: string]: string}>};
    protected abstract originalContent: string;

    public abstract file(file: string): this;

    public abstract text(text: string): this;

    public abstract parse(): string;
}
