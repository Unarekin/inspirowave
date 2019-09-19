import * as fs from 'fs';
import * as path from 'path';
import * as graphlib from 'graphlib';

import * as serialized from './quoteData.json';

const graph = new graphlib.Graph();
// const serialized = JSON.parse(fs.readFileSync(path.join(__dirname, "quoteData.json"), 'utf-8'));


serialized.nodes.forEach((node) => { graph.setNode(node.id, node); });
serialized.edges.forEach((edge) => { graph.setEdge(edge.source, edge.target, edge); });

function shorten(input: string, length: number, separator: string = ' '): string {
  if (input.length <= length) return input;

  return input.substr(0, input.lastIndexOf(separator, length)).trim();
}

function wordBreak(input: string): string[] {
  // Split into 3 lines.
  // First line up to 15,
  // second up to 12,
  // third up to 25 characters


  // let remaining: string = input;
  let firstLine = shorten(input, 14);
  let remaining = input.substr(firstLine.length).trim();
  let secondLine = shorten(remaining, 12);
  remaining = remaining.substr(secondLine.length).trim();
  let thirdLine = shorten(remaining, 24);

  let lines = [firstLine, secondLine, thirdLine];
  // console.log(input);
  // console.log(lines);
  // process.exit();
  return lines
}


export function GenerateQuote(): string[] {
  let loop: boolean = true;
  let quote: string[] = [];

  // Set current to start node.
  let currentNode: any = graph.node("0");

  // console.log("Current: ", currentNode);
  do {
    // Get list of edges
    let edges = graph.outEdges(currentNode.id);
    // Choose one
    let nextEdge = edges[Math.floor(Math.random() * edges.length)];
    // console.log("Edge: ", nextEdge);
    // Move to next node.
    currentNode = graph.node(nextEdge.w);


    // Should we continue?
    if (currentNode.text == "{END}")
      loop=false;
    else
      quote.push(currentNode.text);
  } while (loop);

  return wordBreak(quote.join(" "));
}