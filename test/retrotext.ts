import { should, expect, assert } from 'chai';
import * as request from 'request';
import { RetroText } from '../src/retrotext';

describe.skip('Retrowave Generation', () => {
  it('Generates retrowave image', (done) => {
    RetroText("Your", "Text", "Here", 'chrome', 'palmCircle')
      .then((image: Buffer) => {
        assert.isOk(image, "Buffer not returned.");
        done();
      })
      .catch(done);
  });
})