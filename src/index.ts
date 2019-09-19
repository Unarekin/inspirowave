#!/usr/bin/env node
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
  // .demandOption("o")
  .argv
  ;

// If textStyle and/or bcg aren't specified, select a random one.
let bcg: string = argv.b;
if (!argv.b)
  bcg = "" + Math.floor(Math.random() * 5);

let textStyle: string = argv.t;
if (!argv.t)
  textStyle = '' + Math.floor(Math.random() * 4);

let quote = GenerateQuote();

let outPath="";
// If --out is not specified, default to current directory + text of quote as file name
if (!argv.o)
  outPath = path.join(path.resolve("./"), quote.join("").replace(/( |\.|\!\?|\,)/g, "") + ".jpg");
else
  outPath = path.resolve(argv.o);
// If out path has no file name, add it.
if (!path.extname(outPath))
  outPath = path.join(outPath, quote.join("").replace(/ /g, "") + ".jpg");

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