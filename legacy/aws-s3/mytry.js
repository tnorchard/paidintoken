
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
}).listen(8080);

const fs = require('fs');
 
fs.watchFile("example.txt", {
 
  // Passing the options parameter
  bigint: false,
  persistent: true,
  interval: 1000,
}, (curr, prev) => {
  console.log("\nThe file was edited");
 
  // Time when file was updated
  console.log("File was modified at: ", prev.mtime);
  console.log("File was again modified at: ", curr.mtime);
  console.log(
    "File Content Updated: ",
    fs.readFileSync("example.txt", "utf8")
  );
});