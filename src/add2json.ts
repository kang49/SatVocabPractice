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

    // Create a map of existing words to their corresponding entries
    const vocabularyMap = new Map(existingVocabulary.map((item: { word: string; pron: string; tr: string; read: boolean; readDateTime: string; latestPracticeDate: string }) => [item.word, item]));

    // Add or update entries in the map
    (vocabularyList || []).forEach(item => {
        vocabularyMap.set(item.word, item);
    });

    // Convert the map back to an array
    const combinedVocabulary = Array.from(vocabularyMap.values());

    // Convert the combined list to a JSON string
    const jsonContent = JSON.stringify(combinedVocabulary, null, 2);

    // Write the JSON string to a file
    fs.writeFile(vocab_path, jsonContent, 'utf8', (err) => {
        if (err) {
            console.log('An error occurred while writing JSON to file.');
            return console.log(err);
        }
    });
}
