import { RetroText } from './retrotext';
import { GenerateQuote } from './quotegenerator';
import * as yargs from 'yargs';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);

const argv = yargs
  .string("out")
  .alias("o", "out")
  .string("textStyle")
  .alias("t", "textStyle")
  .string("bcg")
  .alias("b", "bcg")
  .demandOption("o")
  .argv
  ;

// If textStyle and/or bcg aren't specified, select a random one.
let bcg: string = argv.b;
if (!argv.b)
  bcg = "" + Math.floor(Math.random() * 5);

let textStyle: string = argv.t;
if (!argv.t)
  textStyle = '' + Math.floor(Math.random() * 4);


// const outPath: string = path.resolve(argv.o) + (path.extname(argv.o) ? "" : "quote.jpg");
let outPath = path.resolve(argv.o);
if (!path.extname(outPath))
  outPath = path.join(outPath, "quote.jpg");

let quote = GenerateQuote();

RetroText(quote[0], quote[1], quote[2], textStyle, bcg)
  .then((buffer: Buffer) => {
    return writeFile(outPath, buffer);
  })
  .then(() => {
    console.log(quote.join(" "));
    console.log(`Saved to ${outPath}`);
  })
  .catch(console.error)
  ;