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

interface PracticeLog {
    word: string;
    incorrectPractice_count: number;
    totalPractice_count: number;
}

async function AnsChecker(vocab: string, pron: string, translate: string, askEngine: Function) {
    while (true) {
        const answer: string = await askEngine(`Are you correct in "${vocab}"? (y/n/ans) : `);

        if (answer === 'y') {
            return true;
        } else if (answer === 'n') {
            return false;
        } else if (answer === 'ans') {
            const answerList = {
                "Vocap": vocab,
                "Pronoun": pron,
                "Thai": translate
            }
            console.table(answerList);
            continue;
        } else {
            return;
        }
    }
}

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const readJson = (filePath: string): any[] => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log('Error reading existing JSON file:', err);
        return [];
    }
};

const writeJson = (filePath: string, data: any[]): void => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf8');
    } catch (err) {
        console.log('Error writing to JSON file:', err);
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

    let vocabularies = readJson(vocab_path);
    const filteredVocabularies = vocabularies.filter(vocab => vocab.read);

    shuffleArray(filteredVocabularies);
    const limitedVocabularies = filteredVocabularies.slice(0, practice_value);

    for (const vocab of limitedVocabularies) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        const ansResult = await AnsChecker(vocab.word, vocab.pron, vocab.tr, askvocab);

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

    let vocabularies = readJson(vocab_path);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const filteredVocabularies = vocabularies.filter(vocab => vocab.readDateTime === dateStr);
    shuffleArray(filteredVocabularies);

    for (const vocab of filteredVocabularies) {
        const ansResult = await AnsChecker(vocab.word, vocab.pron, vocab.tr, askvocab);

        if (ansResult !== undefined) {
            vocab.latestPracticeDate = dateStr;
            AddStats(vocab.word, ansResult);
        }

        const updatedData = JSON.stringify(vocabularies, null, 2);
        fs.writeFileSync(vocab_path, updatedData, 'utf8');
    }

    rl.close();
}

export async function IncorrectedPractice(vocab_path: string, practiceLog_path: string) {
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

    let vocabsScore: PracticeLog[] = readJson(practiceLog_path);
    let vocabularies: Vocabulary[] = readJson(vocab_path);

    // Sort vocabsScore by incorrectPractice_count in descending order
    vocabsScore.sort((a, b) => b.incorrectPractice_count - a.incorrectPractice_count);

    // Filter vocabularies based on sorted vocabsScore
    let incorrectedVocabularies: Vocabulary[] = [];
    for (const vocabLog of vocabsScore) {
        const match = vocabularies.find(vocab => vocab.word === vocabLog.word);
        if (match) {
            incorrectedVocabularies.push(match);
        }
    }

    // Practice with the incorrected vocabularies
    for (const vocab of incorrectedVocabularies) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        const ansResult = await AnsChecker(vocab.word, vocab.pron, vocab.tr, askvocab);

        if (ansResult !== undefined) {
            vocab.latestPracticeDate = dateStr;
            AddStats(vocab.word, ansResult);
        }
        // Save updated vocabularies
        writeJson(vocab_path, vocabularies);
    }

    rl.close();
}