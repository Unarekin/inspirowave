"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphlib = require("graphlib");
var serialized = require("./quoteData.json");
var graph = new graphlib.Graph();
// const serialized = JSON.parse(fs.readFileSync(path.join(__dirname, "quoteData.json"), 'utf-8'));
serialized.nodes.forEach(function (node) { graph.setNode(node.id, node); });
serialized.edges.forEach(function (edge) { graph.setEdge(edge.source, edge.target, edge); });
function shorten(input, length, separator) {
    if (separator === void 0) { separator = ' '; }
    if (input.length <= length)
        return input;
    return input.substr(0, input.lastIndexOf(separator, length)).trim();
}
function wordBreak(input) {
    // Split into 3 lines.
    // First line up to 15,
    // second up to 12,
    // third up to 25 characters
    // let remaining: string = input;
    var firstLine = shorten(input, 14);
    var remaining = input.substr(firstLine.length).trim();
    var secondLine = shorten(remaining, 12);
    remaining = remaining.substr(secondLine.length).trim();
    var thirdLine = shorten(remaining, 24);
    var lines = [firstLine, secondLine, thirdLine];
    // console.log(input);
    // console.log(lines);
    // process.exit();
    return lines;
}
function GenerateQuote() {
    var loop = true;
    var quote = [];
    // Set current to start node.
    var currentNode = graph.node("0");
    // console.log("Current: ", currentNode);
    do {
        // Get list of edges
        var edges = graph.outEdges(currentNode.id);
        // Choose one
        var nextEdge = edges[Math.floor(Math.random() * edges.length)];
        // console.log("Edge: ", nextEdge);
        // Move to next node.
        currentNode = graph.node(nextEdge.w);
        // Should we continue?
        if (currentNode.text == "{END}")
            loop = false;
        else
            quote.push(currentNode.text);
    } while (loop);
    return wordBreak(quote.join(" "));
}
exports.GenerateQuote = GenerateQuote;
//# sourceMappingURL=quotegenerator.js.map