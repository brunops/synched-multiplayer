var Client = require('./Client');

(function () {
  var canvasContext = document.getElementById('canvas').getContext('2d');

  console.log(canvasContext)

  var client = new Client({
    context: canvasContext
  });

  setInterval(function () {
    client.update();
  }, 1000 / 60);
}());
