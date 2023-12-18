// Create web server
// Start server: node comments.js

// Import modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var ejs = require('ejs');
var url = require('url');
var mysql = require('mysql');

// Connect to MySQL
var client = mysql.createConnection({
  user: 'root',
  password: '1234',
  database: 'Company'
});

// Create web server and start
var server = http.createServer(function(request, response) {
  // Get URL
  var urlParsed = url.parse(request.url);
  // Get pathname
  var pathname = urlParsed.pathname;
  // Get query
  var query = urlParsed.query;

  // Check GET
  if (request.method == 'GET') {
    // Check pathname
    if (pathname == '/') {
      // Read comment.html
      fs.readFile('comment.html', 'utf-8', function(error, data) {
        // Check error
        if (error) {
          // Error
          response.writeHead(500, {
            'Content-Type': 'text/html'
          });
          response.end('500 Internal Server ' + error);
        } else {
          // Success
          response.writeHead(200, {
            'Content-Type': 'text/html'
          });
          // Get data
          client.query('SELECT * FROM comments', function(error, result) {
            // Check error
            if (error) {
              // Error
              console.log('Error: ' + error);
            } else {
              // Success
              // Render HTML
              response.end(ejs.render(data, {
                data: result
              }));
            }
          });
        }
      });
    } else if (pathname == '/delete') {
      // Check query
      if (query == null) {
        // No query
        response.writeHead(400, {
          'Content-Type': 'text/html'
        });
        response.end('400 Bad Request');
      } else {
        // Get query
        var queryParsed = qs.parse(query);
        // Delete data
        client.query('DELETE FROM comments WHERE id=?', [queryParsed.id], function() {
          // Redirect
          response.writeHead(302, {
            'Location': '/'
          });
          response.end();
        });
      }
    } else {
      // Error
      response.writeHead(404, {
        'Content-Type': 'text/html'
      })};
