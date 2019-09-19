// Generated by CoffeeScript 1.12.7
(function() {
  var fs, getImage, num, request;

  fs = require('fs');

  request = require('request');

  num = (process.argv.length > 2 ? process.argv[process.argv.length - 1] : void 0) || 1;

  getImage = function(counter) {
    if (counter === 0) {
      return;
    }
    return request.get('http://inspirobot.me/api?generate=true').on('data', function(data) {
      var image_name, image_url;
      image_url = data.toString();
      image_name = image_url.split('/').pop();
      console.log(image_name);
      request(image_url).pipe(fs.createWriteStream(image_name));
      return getImage(counter - 1);
    }).on('error', function(err) {
      return console.error(err);
    });
  };

  getImage(parseInt(num));

}).call(this);
