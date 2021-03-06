#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var retrotext_1 = require("./retrotext");
var quotegenerator_1 = require("./quotegenerator");
var yargs = require("yargs");
var path = require("path");
var fs = require("fs");
var util = require("util");
var writeFile = util.promisify(fs.writeFile);
var argv = yargs
    .string("out")
    .alias("o", "out")
    .string("textStyle")
    .alias("t", "textStyle")
    .string("bcg")
    .alias("b", "bcg")
    // .demandOption("o")
    .argv;
// If textStyle and/or bcg aren't specified, select a random one.
var bcg = argv.b;
if (!argv.b)
    bcg = "" + Math.floor(Math.random() * 5);
var textStyle = argv.t;
if (!argv.t)
    textStyle = '' + Math.floor(Math.random() * 4);
var quote = quotegenerator_1.GenerateQuote();
var outPath = "";
// If --out is not specified, default to current directory + text of quote as file name
if (!argv.o)
    outPath = path.join(path.resolve("./"), quote.join("").replace(/( |\.|\!\?|\,)/g, "") + ".jpg");
else
    outPath = path.resolve(argv.o);
// If out path has no file name, add it.
if (!path.extname(outPath))
    outPath = path.join(outPath, quote.join("").replace(/ /g, "") + ".jpg");
retrotext_1.RetroText(quote[0], quote[1], quote[2], textStyle, bcg)
    .then(function (buffer) {
    return writeFile(outPath, buffer);
})
    .then(function () {
    console.log(quote.join(" "));
    console.log("Saved to " + outPath);
})
    .catch(console.error);
//# sourceMappingURL=index.js.map