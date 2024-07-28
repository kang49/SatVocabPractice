import * as readline from 'readline';
require('dotenv').config()

import { Auto_addvocab } from './auto_vocabPush';
import { Man_addvocab } from './manual_vocabPush';
import { RandomVocab } from './random_vocab';
import { ReadToday } from './readToday';
import { AddPron } from './add_pron';
import { IncorrectedPractice, Random_Practice, Today_Practice } from './practice';
import { ShowStats } from './statsShow';

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

async function askWindow() {
    const pages1_menuList: string[] = ['today', 'random', 'man-add', 'auto-add', 'pron-add', 'practice', 'stats'];
    console.table(pages1_menuList);
    const pages1 = await askvocab(": ")
    if (pages1 === 'today') {
        const todayvocab = ReadToday('vocabs/vocabs.json');
        console.table(todayvocab)
        rl.close();
    } else if (pages1 === 'random') {
        const random_value = askvocab("What's value of vocab you want to random?: ");
        const random_number: number = parseInt(await random_value)
        const randomvocab = await RandomVocab(random_number, 'vocabs/vocabs.json')
        console.table(randomvocab)
        rl.close();
    } else if (pages1 === 'man-add') {
        rl.close();
        Man_addvocab();
    } else if (pages1 === 'auto-add') {
        Auto_addvocab();
    } else if (pages1 === 'pron-add') {
        rl.close();
        AddPron('vocabs/vocabs.json');
    } else if (pages1 === 'practice') {
        const pages2_menulist: string[] = ['random', 'today', 'incor'];
        console.table(pages2_menulist);
        const pages2 = await askvocab(": ");
        if (pages2 === 'random') {
            const random_value = askvocab("What's value of vocab you want to random?: ");
            const random_number: number = parseInt(await random_value)
            rl.close();
            Random_Practice('vocabs/vocabs.json', random_number);
        } else if (pages2 === 'today') {
            rl.close();
            Today_Practice('vocabs/vocabs.json');
        } else if (pages2 === 'incor') {
            rl.close();
            IncorrectedPractice('vocabs/vocabs.json', 'db/practiceLog.json');
        }
    } else if (pages1 === 'stats') {
        rl.close();
        ShowStats();
    }
}

askWindow();