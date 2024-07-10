import * as readline from 'readline';
import { Add2json } from './add2json';

export function Man_addvocab() {
    // Create an interface for readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Function to ask a question and get input
    const askvocab = (question: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    };
    const vocabularyList: Array<{ word: string; pron: string; tr: string; read: boolean; readDateTime: string; latestPracticeDate: string }> = [];
    // Example usage
    (async () => {
        while (true) {
            const vocab = await askvocab("What's your vocab to add? : ");
            if (vocab === 'nnn') break
            
            const jsonObject = {
                word: vocab,
                pron: "",
                tr: "",
                read: false,
                readDateTime: "",
                latestPracticeDate: ""
            };

            vocabularyList.push(jsonObject);

            Add2json(vocabularyList, 'vocabs/vocabs.json');
        }

        rl.close();
    })();
}