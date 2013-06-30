// config
var config = require('./config');

// Require the twilio and HTTP modules
var twilio = require('twilio'),
    http = require('http'),
    request = require('request');
 
// Create an HTTP server, listening on port 1337
http.createServer(function (req, res) {
  // parse URL
  var url_parts = require('url').parse(req.url);
  console.log('path: ' + url_parts.pathname);

  if(url_parts.pathname == '/') {
    // Create a TwiML response and a greeting
    var resp = new twilio.TwimlResponse();

    resp.say(config.voice, config.msg.greeting);

    // The <Gather> verb requires nested TwiML, so we pass in a function
    // to generate the child nodes of the XML document
    var url = '/call.js'
    resp.gather({ numDigits:1, action:url, timeout:30 }, function() {
        // In the context of the callback, "this" refers to the parent TwiML
        // node.  The parent node has functions on it for all allowed child
        // nodes. For <Gather>, these are <Say> and <Play>.
        this.say(config.voice, config.msg.menu);
    });
 
    //Render the TwiML document using "toString"
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  } else if(url_parts.pathname.substr(0, 5) == '/call') {
    // polling code here
    var twiml = twilio.Twiml;

    var resp = new twilio.TwimlResponse();

    resp.say(config.voice, config.msg.wait);
    resp.dial("+15712771477");

    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  } else {
    console.log('not handled path:' + url_parts.pathname);
  }
}).listen(80);
 
