import { should, expect, assert } from 'chai';

import { GenerateQuote } from '../src/quotegenerator';

describe("Quote generation", () => {
  it("Generates a quote", (done) => {
    let quote: string[] = GenerateQuote();
    assert.isOk(quote);
    console.log(quote);
    done();
  });
});