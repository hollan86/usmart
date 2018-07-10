var Twit = require('twit')
var fs = require('fs')
const express = require('express')
const app = express()

var WebSocketServer = require('websocket').server;
var http = require('http');





 app.use(express.static('public'))

 app.get('/', (req, res) => res.send('public/index.html'))
 app.get('/twitter-stream', (req,res) => {
    console.log('twitter request');
    var T = new Twit({
        consumer_key:         '6vvUfvtWZ7EjVmDhGrfs250a3',
        consumer_secret:      'qMV1NY0TgfI93FpyQF5hp67KaUzblCuLFnF8ouIQ8LNUViTn4Z',
        access_token:         '276032007-53CgtLBvWNSzzITSbWvwrYy3FIwqclpJ0snTdIlB',
        access_token_secret:  'bxMHeisayMUl5QmlKwidtfKFxdDVpewGgJbVJzUIpNILE',
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
      });
    
    var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })
    
    stream.on('tweet', function (tweet) {
       console.log(tweet);
       
     })
     
 });
 
 const server = http.createServer(app);
 server.listen(9999, () => console.log('Example app listening on port 9999!'))
 wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    // console.log(request);
    
    var connection = request.accept('echo-protocol', request.origin);
    // connection.accept()
    console.log((new Date()) + ' Connection accepted.');
    //START SENDING TWEETS!
    var T = new Twit({
        consumer_key:         '6vvUfvtWZ7EjVmDhGrfs250a3',
        consumer_secret:      'qMV1NY0TgfI93FpyQF5hp67KaUzblCuLFnF8ouIQ8LNUViTn4Z',
        access_token:         '276032007-53CgtLBvWNSzzITSbWvwrYy3FIwqclpJ0snTdIlB',
        access_token_secret:  'bxMHeisayMUl5QmlKwidtfKFxdDVpewGgJbVJzUIpNILE',
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
      });
    
    var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })
    var stream2 = T.stream('statuses/filter', { track: '#market', language: 'en' })

    stream.on('tweet', function (tweet) {
    //    console.log(tweet);
       //connection.send(JSON.stringify(tweet));
       connection.send('apple')
     })

     stream2.on('tweet', function (tweet) {
        // console.log(tweet);
        //connection.send(JSON.stringify(tweet));
        connection.send('market')
      })
    //END SENDING TWEETS
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

