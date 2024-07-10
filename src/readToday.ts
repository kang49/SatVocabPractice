import * as fs from 'fs';

interface Vocabulary {
    word: string;
    pron: string;
    syno: string;
    tr: string;
    read: boolean;
    readDateTime: string;
    latestPracticeDate: string;
}

export function ReadToday(vocab_path: string) {
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
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Get only the date part

    // Filter vocabularies where read is false and limit to `value`
    const filteredVocabularies = vocabularies.filter(vocab => vocab.readDateTime === dateStr);

    return filteredVocabularies
}