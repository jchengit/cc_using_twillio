// post data from twillio when calling call_end
var  s = "body AccountSid=AC7f2cf53571e10de5a168ab7da888a9c6&ToZip=98006&FromState=WA&Called=%2B14254096518&FromCountry=US&CallerCountry=US&CalledZip=98006&Direction=inbound&FromCity=KIRKLAND&CalledCountry=US&CallerState=WA&DialCallDuration=3&CallSid=CA260fc9e5613cd829452059786fda9765&CalledState=WA&From=%2B14258828080&CallerZip=98008&FromZip=98008&CallStatus=in-progress&DialCallSid=CAa7b77857b8cf69961b57c9eee7fb84bf&ToCity=SEATTLE&ToState=WA&RecordingUrl=http%3A%2F%2Fapi.twilio.com%2F2010-04-01%2FAccounts%2FAC7f2cf53571e10de5a168ab7da888a9c6%2FRecordings%2FREc57186919305408fdf094ae6f3be53b3&To=%2B14254096518&ToCountry=US&DialCallStatus=completed&RecordingDuration=3&CallerCity=KIRKLAND&ApiVersion=2010-04-01&Caller=%2B14258828080&CalledCity=SEATTLE&RecordingSid=REc57186919305408fdf094ae6f3be53b3"

var querystring = require('querystring');
var v = querystring.parse(s);
console.log(v);


