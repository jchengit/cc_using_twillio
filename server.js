// Require the twilio and HTTP modules
var twilio = require('twilio'),
    http = require('http'),
    request = require('request');
 
// get dns name of the running ec2 instance
// curl -s http://169.254.169.254/latest/meta-data/public-hostname
var hostname = '';
request('http://169.254.169.254/latest/meta-data/public-hostname',
  function (error, response, body) {
  if (!error && response.statusCode == 200) {
    hostname = body;
    console.log('hostname: ' + body) // Print the google web page.
  }
})

// Create an HTTP server, listening on port 1337
http.createServer(function (req, res) {
  // parse URL
  var url_parts = require('url').parse(req.url);
  console.log('path: ' + url_parts.pathname);

  if(url_parts.pathname == '/') {
    // Create a TwiML response and a greeting
    var resp = new twilio.TwimlResponse();
    resp.say({voice:'woman'}, 'Welcome to Min Education Services');
 
    // The <Gather> verb requires nested TwiML, so we pass in a function
    // to generate the child nodes of the XML document
    var url = '/call.js'
    resp.gather({ numDigits:1, action:url, timeout:30 }, function() {
        // In the context of the callback, "this" refers to the parent TwiML
        // node.  The parent node has functions on it for all allowed child
        // nodes. For <Gather>, these are <Say> and <Play>.
        this.say('For medical issues, press 1. For transportation issues, press 2. For education issues, press 3');
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
    resp.say({voice:'woman'}, 'Will connect you to our agent, please wait...');
    resp.dial("+14258671432");

    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  } else {
    console.log('not handled path:' + url_parts.pathname);
  }
}).listen(80);
 
