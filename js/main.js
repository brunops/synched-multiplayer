var Client = require('./Client');

window.requestAnimFrame = (function () {
  'use strict';
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function (callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();

(function () {
  var canvasContext = document.getElementById('canvas').getContext('2d');

  var client = new Client({
    context: canvasContext
  });


  window.requestAnimFrame(function update() {
    client.update();

    window.requestAnimFrame(update);
  });
}());
