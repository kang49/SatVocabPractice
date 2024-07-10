import cheerio from 'cheerio';

export async function WebSc(url: string): Promise<Array<{ word: string; pron: string; tr: string; read: boolean; readDateTime: string; latestPracticeDate: string }> | null> {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.text();
            //Get vocabs
            const che = cheerio.load(responseData);
            const vocabularyList: Array<{ word: string; pron: string; tr: string; read: boolean; readDateTime: string; latestPracticeDate: string }> = [];

            
            for(let i = 1; i < 2168; i++) {
                const elementSelector = `#sortable_wordlist > li:nth-child(${i}) > a`;
                const element = che(elementSelector);

                if (element.length > 0 && element.text().trim()) {
                    let vocab: string = element.text().trim()
                    console.log(vocab, `<== Pushing ${((i/2168)*100).toFixed(2)}%`)
                    
                    const jsonObject = {
                        word: vocab,
                        pron: "",
                        tr: "",
                        read: false,
                        readDateTime: "",
                        latestPracticeDate: "",
                    };
            
                    vocabularyList.push(jsonObject);
                }
                else continue
            }
            return vocabularyList;
        } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
