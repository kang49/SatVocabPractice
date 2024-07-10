import * as fs from 'fs';

// Function to read and parse existing JSON file
const readExistingVocabulary = (filePath: string) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log('Error reading existing JSON file:', err);
        return [];
    }
};

export function Add2json(vocabularyList: null | Array<{ word: string; pron: string; tr: string; read: boolean; readDateTime: string; latestPracticeDate: string }>, vocab_path: string) {
    // Read existing vocabulary from the file
    let existingVocabulary = readExistingVocabulary(vocab_path);

    // Create a set of existing words for quick lookup
    const existingWords = new Set(existingVocabulary.map((item: { word: string; }) => item.word));

    // Filter out words that already exist
    const newVocabulary = (vocabularyList || []).filter(item => !existingWords.has(item.word));

    // Combine existing vocabulary with new vocabulary
    const combinedVocabulary = existingVocabulary.concat(newVocabulary);

    // Convert the combined list to a JSON string
    const jsonContent = JSON.stringify(combinedVocabulary, null, 2);

    // Write the JSON string to a file
    fs.writeFile(vocab_path, jsonContent, 'utf8', (err) => {
        if (err) {
            console.log('An error occurred while writing JSON to file.');
            return console.log(err);
        }
        console.log('JSON file has been updated.');
    });
}
