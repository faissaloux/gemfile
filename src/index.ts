import * as fs from 'fs';

export function parse(file: string) {
    const content = fs.readFileSync(file, 'utf-8');
    
    content.split(/\r?\n/).forEach((line: string) => {
        console.log('line: ', line);
    });
}
