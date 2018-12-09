const path = require('path')

function historyApiFallbackMiddleware (compiler) {
  return function (req, res, next) {
    let filename = path.join(compiler.outputPath,'index.html');
    compiler.outputFileSystem.readFile(filename, function(err, result){
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  }
}

exports = module.exports = historyApiFallbackMiddleware
