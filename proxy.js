require('log-timestamp');
const uuidv4 = require('uuid/v4');
const chalk = require('chalk');
var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with latency
//
var proxy = httpProxy.createProxyServer();

//
// Create your server that makes an operation that waits a while
// and then proxies the request
//
http.createServer(function (req, res) {
  res.socket.setTimeout(6 * 60 * 1000); // default timeout is 2min
  req.socket.setTimeout(6 * 60 * 1000); // default timeout is 2min
  let uuid = uuidv4();
  if (req.url.startsWith('/batch/file?') || req.url.startsWith('/api/plugins/download')) {
    console.log(chalk.cyan(uuid) + " " + chalk.green(req.url + " delayed with 5min"));
    setTimeout(function () {
      console.log(chalk.cyan(uuid) + " response sent");
      proxy.web(req, res, {
        target: 'http://localhost:9000'
      });
    }, 300000);
  } else {
    console.log(chalk.green(req.url));
    proxy.web(req, res, {
        target: 'http://localhost:9000'
      });
  }
}).listen(8000);

