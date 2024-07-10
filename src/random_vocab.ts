import * as fs from 'fs';
require('dotenv').config();

interface Vocabulary {
    word: string;
    pron: string;
    syno: string;
    tr: string;
    read: boolean;
    readDateTime: string;
    latestPracticeDate: string;
}

export async function RandomVocab(value: number, vocab_path: string): Promise<Vocabulary[]> {
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

    // Filter vocabularies where read is false
    const filteredVocabularies = vocabularies.filter(vocab => !vocab.read);

    // Randomly select `value` number of vocabularies
    const selectedVocabularies: Vocabulary[] = [];
    const selectedIndices: Set<number> = new Set();
    while (selectedVocabularies.length < value && selectedIndices.size < filteredVocabularies.length) {
        const randomIndex = Math.floor(Math.random() * filteredVocabularies.length);
        if (!selectedIndices.has(randomIndex)) {
            selectedVocabularies.push(filteredVocabularies[randomIndex]);
            selectedIndices.add(randomIndex);
        }
    }

    // Add current date to selected vocabularies
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Get only the date part

    // Translate the words and update the vocabularies
    await Promise.all(selectedVocabularies.map(async vocab => {
        // Microsoft Translator API
        const microsoftTrAPI = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate?to=th&api-version=3.0&profanityAction=NoAction&textType=plain',
            params: {
                'api-version': '3.0',
                profanityAction: 'NoAction',
                textType: 'plain'
            },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY!,
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            body: JSON.stringify([{ Text: vocab.word }])
        };

        const response = await fetch(microsoftTrAPI.url, {
            method: microsoftTrAPI.method,
            headers: microsoftTrAPI.headers,
            body: microsoftTrAPI.body
        });

        const translatedVocab = await response.json();

        vocab.tr = translatedVocab[0].translations[0].text;
        vocab.read = true; // Mark as read
        vocab.readDateTime = dateStr; // Assign the current date
    }));

    // Save updated vocabularies back to the JSON file (if needed)
    const updatedData = JSON.stringify(vocabularies, null, 2);
    fs.writeFileSync(vocab_path, updatedData, 'utf8');

    return selectedVocabularies;
}
