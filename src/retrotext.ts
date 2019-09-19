import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';
import * as util from 'util';
import * as cheerio from 'cheerio';

const post = util.promisify(request.post);
const get = util.promisify(request.get);

export function RetroText(text1: string, text2: string, text3: string, textStyle: string = '0', bcg: string = '0'): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    // Random server ID
    let server: number = Math.floor(Math.random() * 10);
    let url: string = `https://photofunia.com/categories/all_effects/retro-wave?server=${server}`;

    let form: any ={
      bcg,
      txt: textStyle,
      text1,
      text2,
      text3
    };

    // console.log("POSTing: ", form, url);

    post({url: url, formData: form})
      .then((response, body) => {
        if (response.headers.location)
          return get(`https://photofunia.com${response.headers.location}`);
        else
          throw new Error("No redirect location given.");
      })
      .then((res) => {
        // fs.writeFileSync(path.join(__dirname, "response.txt"), res.body);
        let $ = cheerio.load(res.body);
        let src = $("#result-image").attr('src');

        request.head(src, (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            let contentType = res.headers['content-type'];
            let contentLength = res.headers['content-length'];

            let bufs: Buffer[] = [];

            request(src)
              .on('data', (data: Buffer) => { bufs.push(data); })
              .on('end', () => {
                let buf = Buffer.concat(bufs);
                resolve(buf);
              })
              .on('error', reject);
          }
        })
      })
      .catch(reject);
  });
}