"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var util = require("util");
var cheerio = require("cheerio");
var post = util.promisify(request.post);
var get = util.promisify(request.get);
function RetroText(text1, text2, text3, textStyle, bcg) {
    if (textStyle === void 0) { textStyle = '0'; }
    if (bcg === void 0) { bcg = '0'; }
    return new Promise(function (resolve, reject) {
        // Random server ID
        var server = Math.floor(Math.random() * 10);
        var url = "https://photofunia.com/categories/all_effects/retro-wave?server=" + server;
        var form = {
            bcg: bcg,
            txt: textStyle,
            text1: text1,
            text2: text2,
            text3: text3
        };
        // console.log("POSTing: ", form, url);
        post({ url: url, formData: form })
            .then(function (response, body) {
            if (response.headers.location)
                return get("https://photofunia.com" + response.headers.location);
            else
                throw new Error("No redirect location given.");
        })
            .then(function (res) {
            // fs.writeFileSync(path.join(__dirname, "response.txt"), res.body);
            var $ = cheerio.load(res.body);
            var src = $("#result-image").attr('src');
            request.head(src, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                else {
                    var contentType = res.headers['content-type'];
                    var contentLength = res.headers['content-length'];
                    var bufs_1 = [];
                    request(src)
                        .on('data', function (data) { bufs_1.push(data); })
                        .on('end', function () {
                        var buf = Buffer.concat(bufs_1);
                        resolve(buf);
                    })
                        .on('error', reject);
                }
            });
        })
            .catch(reject);
    });
}
exports.RetroText = RetroText;
//# sourceMappingURL=retrotext.js.map