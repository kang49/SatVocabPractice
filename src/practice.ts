import * as readline from 'readline';
import * as fs from 'fs';
import { AddStats } from './stats_keeper';

interface Vocabulary {
    word: string;
    pron: string;
    syno: string;
    tr: string;
    read: boolean;
    readDateTime: string;
    latestPracticeDate: string;
}

async function AnsChecker(vocab: string, askEngine: Function) {
    const answer: string = await askEngine(`Are you correct in "${vocab}"? (y/n) : `);
    
    if (answer === 'y') {
        return true;
    } else if (answer === 'n') {
        return false;
    } else return;
}

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export async function Random_Practice(vocab_path: string, practice_value: number) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askvocab = (question: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    };

    const readJson = (filePath: string): Vocabulary[] => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.log('Error reading existing JSON file:', err);
            return [];
        }
    };

    let vocabularies = readJson(vocab_path);
    const filteredVocabularies = vocabularies.filter(vocab => vocab.read);

    shuffleArray(filteredVocabularies);
    const limitedVocabularies = filteredVocabularies.slice(0, practice_value);
    
    for (const vocab of limitedVocabularies) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        const ansResult = await AnsChecker(vocab.word, askvocab);
        
        if (ansResult !== undefined) {
            vocab.latestPracticeDate = dateStr;
            AddStats(vocab.word, ansResult);
        }

        const updatedData = JSON.stringify(vocabularies, null, 2);
        fs.writeFileSync(vocab_path, updatedData, 'utf8');
    }

    rl.close();
}

export async function Today_Practice(vocab_path: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askvocab = (question: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    };

    const readJson = (filePath: string): Vocabulary[] => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.log('Error reading existing JSON file:', err);
            return [];
        }
    };

    let vocabularies = readJson(vocab_path);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const filteredVocabularies = vocabularies.filter(vocab => vocab.readDateTime === dateStr);
    shuffleArray(filteredVocabularies);

    for (const vocab of filteredVocabularies) {
        const ansResult = await AnsChecker(vocab.word, askvocab);
        
        if (ansResult !== undefined) {
            vocab.latestPracticeDate = dateStr;
            AddStats(vocab.word, ansResult);
        }

        const updatedData = JSON.stringify(vocabularies, null, 2);
        fs.writeFileSync(vocab_path, updatedData, 'utf8');
    }

    rl.close();
}
