import * as fs from 'fs';
import * as readline from 'readline';

interface Vocabulary {
    word: string;
    pron: string;
    syno: string;
    tr: string;
    read: boolean;
    readDateTime: string;
    latestPracticeDate: string;
}

export function AddPron(vocab_path: string) {
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

    // Function to read and parse existing JSON file
    const readJson = (filePath: string): Vocabulary[] => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.log('Error reading existing JSON file:', err);
            return [];
        }
    };

    // Read JSON data
    let vocabularies = readJson(vocab_path);

    // Filter vocabularies where read is false and limit to `value`
    const filteredVocabularies = vocabularies.filter(vocab => vocab.read && !vocab.pron);
        
        if (filteredVocabularies) {
        filteredVocabularies.forEach(async vocab => {
            const pron_ans = await askvocab(`"${vocab.word}" : `);

            vocab.pron = pron_ans;

            // Save updated vocabularies back to the JSON file (if needed)
            const updatedData = JSON.stringify(vocabularies, null, 2);
            fs.writeFileSync(vocab_path, updatedData, 'utf8');

            return;
        })
    } else {
        console.log('No any vocab need pron.')
    }

}