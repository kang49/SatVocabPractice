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
    //If already exiting log for today
    if (filteredDsLog && filteredDsLog.length > 0) {
        filteredDsLog.map(log => {
            if (isCorrect) log.correct = log.correct + 1;
            else if (!isCorrect) log.incorrect = log.incorrect + 1;
        })

        // Convert the combined list to a JSON string
        const jsonContent = JSON.stringify(filteredDsLog, null, 2);

        fs.writeFile('db/dayScoreLog.json', jsonContent, 'utf8', (err) => {
            if (err) {
                console.log('An error occurred while writing JSON to file.');
                return console.log(err);
            }
        });
    } else {
        if (isCorrect) {
            const jsonObject = {
                correct: 1,
                incorrect: 0,
                Date: dateStr
            };

            const combinedDsLog = dayScoreLogJson.concat(jsonObject);

            // Convert the combined list to a JSON string
            const jsonContent = JSON.stringify(combinedDsLog, null, 2);

            fs.writeFile('db/dayScoreLog.json', jsonContent, 'utf8', (err) => {
                if (err) {
                    console.log('An error occurred while writing JSON to file.');
                    return console.log(err);
                }
            });
        }
        else if (!isCorrect) {
            const jsonObject = {
                correct: 0,
                incorrect: 1,
                Date: dateStr
            };

            const combinedDsLog = dayScoreLogJson.concat(jsonObject);

            // Convert the combined list to a JSON string
            const jsonContent = JSON.stringify(combinedDsLog, null, 2);

            fs.writeFile('db/dayScoreLog.json', jsonContent, 'utf8', (err) => {
                if (err) {
                    console.log('An error occurred while writing JSON to file.');
                    return console.log(err);
                }
            });
        }

    }
    //Memory clearing
    dayScoreLogJson = [];
    filteredDsLog = [];

    //=>>>>>>>>>>>>>>>>>>>>END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //Practice Log =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    let practiceLogJson: practiceLogJson[] = readJson('db/practiceLog.json');

    let filteredPracticeLog = practiceLogJson.filter(log => log.word === vocab);
    //If already exiting log for today
    if (filteredPracticeLog && filteredPracticeLog.length > 0) {
        filteredPracticeLog.map(log => {
            if (isCorrect) {
                log.totalPractice_count + 1;
            } else if (!isCorrect) {
                log.incorrectPractice_count + 1;
                log.totalPractice_count + 1;
            }
        })
    } else {
        if (isCorrect) {
            const jsonObject = {
                word: vocab,
                incorrectPractice_count: 0,
                totalPractice_count: 1
            }

            const combinedPracticeLog = practiceLogJson.concat(jsonObject);

            //Convert the combined list to a JSON to a JSON string
            const jsonContent = JSON.stringify(combinedPracticeLog, null, 2);

            fs.writeFile('db/practiceLog.json', jsonContent, 'utf8', (err) => {
                if (err) {
                    console.log('An error occurred while writing JSON to file.');
                    return console.log(err);
                }
            });
        } else if (!isCorrect) {
            const jsonObject = {
                word: vocab,
                incorrectPractice_count: 1,
                totalPractice_count: 1
            }

            const combinedPracticeLog = practiceLogJson.concat(jsonObject);

            //Convert the combined list to JSON string
            const jsonContent = JSON.stringify(combinedPracticeLog, null, 2);

            fs.writeFile('db/practiceLog.json', jsonContent, 'utf8', (err) => {
                if (err) {
                    console.log('An error occurred while writing JSON to file.');
                    return console.log(err);
                }
            });
        }
    }
    //Memory clearing
    practiceLogJson = [];
    filteredPracticeLog = [];

    //=>>>>>>>>>>>>>>>>>>>>END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
}