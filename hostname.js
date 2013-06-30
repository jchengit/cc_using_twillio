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

