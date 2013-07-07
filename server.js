// config
var config = require('./config');

// Require the twilio and HTTP modules
var twilio = require('twilio'),
    fs = require('fs'),
    http = require('http'),
    querystring = require('querystring');
    request = require('request');
 
// load agent phone numbers
// NOTE - must use double quotas for string, NOT single quotas 
var agents = JSON.parse(fs.readFileSync('agents.json'));
for (var i=0; i<agents.length; i++) {
    agents[i].avail = true; // initialize to free status
    //console.log(agents[i].name + ': ' + agents[i].num + ' ' + agents[i].avail);
}

// get next free agent
var next_agent = function() {
    for (var i=0; i<agents.length; i++) {
        if (agents[i].avail == true) return i;
    }
    return -1;
}

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
    var url = '/call_start.js'
    resp.gather({ numDigits:1, action:url, timeout:30 }, function() {
        // In the context of the callback, "this" refers to the parent TwiML
        // node.  The parent node has functions on it for all allowed child
        // nodes. For <Gather>, these are <Say> and <Play>.
        this.say(config.voice, config.msg.menu);
    });
 
    //Render the TwiML document using "toString"
    res.writeHead(200, { 'Content-Type':'text/xml' });
    res.end(resp.toString());
  } else if(url_parts.pathname.substr(0, 11) == '/call_start') {
    // polling code here
    var twiml = twilio.Twiml;

    var resp = new twilio.TwimlResponse();

    resp.say(config.voice, config.msg.wait);
    var aid = next_agent();
    if (aid == -1) {
        console.log('no free agent');
        resp.say(config.voice, "all agents are busy, please call later");
        // TODO - ask user to call later
    } else {
        console.log('will call ' + agents[aid].name + ': ' + agents[aid].num);
        agents[aid].avail = false;
        var url = '/call_end.js?agent_id=' + aid;
        resp.dial(agents[aid].num, {action:url, record:true});
        //resp.dial("+15712771477");
    }

    res.writeHead(200, { 'Content-Type':'text/xml' });
    res.end(resp.toString());
  } else if(url_parts.pathname.substr(0, 9) == '/call_end') {
    var query = querystring.parse(url_parts.query);
    var aid = query.agent_id;
    if (aid  && aid > -1) {
        console.log('for ' + agents[aid].name + ': ' + agents[aid].num);
    } else {
        console.log('can not get aid, query is %s', query);
    }

    if (req.method == 'POST') {
        var body='';
        req.on('data', function(data) { body += data; });
        req.on('end', function() {
            var v = querystring.parse(body)
            var call_status = v.DialCallStatus;

            console.log('call status is ' + call_status);
            if (call_status == 'completed' || 
                call_status == 'no-answer' ||
                call_status == 'busy' ||
                call_status == 'failed' ||
                call_status == 'canceled') {
                agents[aid].avail = true;
                console.log(agents[aid].name + ': ' + agents[aid].num + ' set avail true');
            } else {
                // TODO - handle
            }
        });
    } else {
        console.log('path method not POST is not expected:');
    }

    var resp = new twilio.TwimlResponse();
    res.writeHead(200, { 'Content-Type':'text/xml' });
    res.end(resp.toString());
  } else {
    console.log('not handled path:' + url_parts.pathname);
    // TODO - print input
  }
}).listen(80);
 
