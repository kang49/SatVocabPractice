import * as fs from 'fs'

interface dsLog {
    correct: number;
    incorrect: number;
    Date: string;
}
interface practiceLogJson {
    word: string;
    incorrectPractice_count: number;
    totalPractice_count: number;
}

export function AddStats(vocab: string, isCorrect: boolean) {
    // Function to read and parse existing JSON file
    const readJson = (filePath: string): any[] => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.log('Error reading existing JSON file:', err);
            return [];
        }
    };
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Get only the date part

    // Day Score Log =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let dayScoreLogJson: dsLog[] = readJson('db/dayScoreLog.json');

    let filteredDsLog = dayScoreLogJson.filter(log => log.Date === dateStr);

    if (filteredDsLog && filteredDsLog.length > 0) {
        filteredDsLog.map(log => {
            if (isCorrect) log.correct += 1;
            else log.incorrect += 1;
        });

        dayScoreLogJson = dayScoreLogJson.map(log => {
            let updatedLog = filteredDsLog.find(updated => updated.Date === log.Date);
            return updatedLog ? updatedLog : log;
        });

        const jsonContent = JSON.stringify(dayScoreLogJson, null, 2);

        fs.writeFile('db/dayScoreLog.json', jsonContent, 'utf8', (err) => {
            if (err) {
                console.log('An error occurred while writing JSON to file.');
                return console.log(err);
            }
        });
    } else {
        const jsonObject = {
            correct: isCorrect ? 1 : 0,
            incorrect: isCorrect ? 0 : 1,
            Date: dateStr
        };

        const combinedDsLog = dayScoreLogJson.concat(jsonObject);

        const jsonContent = JSON.stringify(combinedDsLog, null, 2);

        fs.writeFile('db/dayScoreLog.json', jsonContent, 'utf8', (err) => {
            if (err) {
                console.log('An error occurred while writing JSON to file.');
                return console.log(err);
            }
        });
    }

    dayScoreLogJson = [];
    filteredDsLog = [];

    //=>>>>>>>>>>>>>>>>>>>>END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //Practice Log =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let practiceLogJson: practiceLogJson[] = readJson('db/practiceLog.json');

    let filteredPracticeLog = practiceLogJson.filter(log => log.word === vocab);

    if (filteredPracticeLog && filteredPracticeLog.length > 0) {
        filteredPracticeLog.map(log => {
            if (isCorrect) {
                if (log.incorrectPractice_count > 0) {
                    log.incorrectPractice_count -= 1;
                }

                log.totalPractice_count += 1;
            } else {
                log.incorrectPractice_count += 1;
                log.totalPractice_count += 1;
            }
        });

        practiceLogJson = practiceLogJson.map(log => {
            let updatedLog = filteredPracticeLog.find(updated => updated.word === log.word);
            return updatedLog ? updatedLog : log;
        });

        const jsonContent = JSON.stringify(practiceLogJson, null, 2);

        fs.writeFile('db/practiceLog.json', jsonContent, 'utf8', (err) => {
            if (err) {
                console.log('An error occurred while writing JSON to file.');
                return console.log(err);
            }
        });
    } else {
        const jsonObject = {
            word: vocab,
            incorrectPractice_count: isCorrect ? 0 : 1,
            totalPractice_count: 1
        };

        const combinedPracticeLog = practiceLogJson.concat(jsonObject);

        const jsonContent = JSON.stringify(combinedPracticeLog, null, 2);

        fs.writeFile('db/practiceLog.json', jsonContent, 'utf8', (err) => {
            if (err) {
                console.log('An error occurred while writing JSON to file.');
                return console.log(err);
            }
        });
    }

    practiceLogJson = [];
    filteredPracticeLog = [];
    //=>>>>>>>>>>>>>>>>>>>>END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
}