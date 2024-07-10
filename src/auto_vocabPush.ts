import { WebSc } from "./webscraping";
import { Add2json } from "./add2json";

export function Auto_addvocab() {
    (async () => {
        const url = 'https://www.wordnik.com/lists/sat-vocabulary-list';

        const webscraping = await WebSc(url);
        console.log(webscraping);

        Add2json(webscraping, 'vocabs/vocabs.json');

    })();
}