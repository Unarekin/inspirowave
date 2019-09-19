import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import * as request from 'request';
import * as ProgressBar from 'progress';
import * as util from 'util';

const get = util.promisify(request.get);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

interface Node {
  id: string,
  text: string
};

interface Edge {
  source: string,
  target: string
};

interface Graph {
  nodes: Node[],
  edges: Edge[]
};

const QUOTE_DB: string = "https://www.successories.com/iquote/category/39/inspirational-quotes/"
const QUOTE_PAGES: number = 19

const SELECTOR: string = "div.quote";

// let allQuotes: string[] = [];
let knownWords: string[] = [
  "{START}",
  "{END}"
];

let graph: Graph = {
  nodes: [
    {
      id: "0",
      text: "{START}"
    },
    {
      id: "1",
      text: "{END}"
    }
  ],
  edges: []
}


function getQuotesForPage(page: number): string[] {
  return get(QUOTE_DB + page)
    .then((response) => {
      let $ = cheerio.load(response.body);
      let quotes = $(SELECTOR).map(function(i, el) {
        let text: string = $(this).text();
        return text.substr(1, text.length-2);
        // return $(this).text().substr(1,);
      })
      .get();

      return quotes;
    })
    ;
}



// let progress = new ProgressBar("Building quote graph [:bar] :current/:total (:percent) :etas", {
//   total: QUOTE_PAGES,
//   incomplete: ' '
// });

// progress.tick(0);


function wordBreak(word: string): string[] {
  return word.split(" ");
}

function addWord(word: string): number {
  let index = knownWords.indexOf(word);
  if (index == -1) {
    knownWords.push(word);
    index = knownWords.length-1;
    graph.nodes.push({
      id: String(index),
      text: word
    });
  }

  return index;
}

function linkWord(prev: string, current: string): void {
  let first: number = knownWords.indexOf(prev);
  let second: number = knownWords.indexOf(current);

  if (first == -1)
    throw new Error(`Could not find word ${prev} in hash.`);
  if (second == -1)
    throw new Error(`Could not find word ${current} in hash.`);

  graph.edges.push({
    source: String(first),
    target: String(second)
  });
}

function parseQuote(quote: string): void {
  let words = wordBreak(quote);

  words.forEach((word: string, idx: number) => {
    let index = addWord(word);
    if (idx > 0)
      linkWord(words[idx-1], word);
    else
      linkWord("{START}", word);

    // If the word ends in a period, question mark, or exclamation mark, also link it to {END}
    let last = word.substr(-1);
    if (last == "." || last == "?" || last == "!")
      linkWord(word, "{END}");
  });

  linkWord(words[words.length-1], "{END}");
}

function writeReadFile(file: string, content: Buffer): Promise<Buffer> {
  return writeFile(file, content)
          .then(() => content);
}


readFile(path.join(__dirname, "quotes.txt"))
  .then((buffer: Buffer) => {
    console.log("Reading from quotes.txt");
    let text = buffer.toString();
    let quotes = text.split("\n");
    quotes.forEach(parseQuote);
  })
  .catch((err) => {
    console.log("Downloading from source.");
    let allQuotes: string[] = [];
    let chain = Promise.resolve();
    for (let i=1;i<=QUOTE_PAGES;i++) {
      chain = chain.then(() => getQuotesForPage(i))
        .then((quotes) => {
          allQuotes = allQuotes.concat(quotes);
          quotes.forEach(parseQuote);
        })
        ;
    }
    chain = chain.then(() => writeFile(path.join(__dirname, "quotes.txt"), allQuotes.join("\n")))
    return chain;
  })
  .then(() => writeFile(path.join(__dirname, "quoteData.json"), JSON.stringify(graph)))
  .catch(console.error)
  ;