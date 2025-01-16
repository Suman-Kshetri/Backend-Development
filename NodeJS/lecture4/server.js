const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const logEvents = require('./logEvents')

const Emitter = require("events");
//Create Custom Emitter:
class customEmitter extends Emitter {}
//A custom emitter class extends the base EventEmitter class from the events module.

//initializing object
const myEmitter = new customEmitter();

//add listener for the log event
myEmitter.on('log', (msg,filename) => {logEvents(msg,filename)});


//defininG the port
const PORT = process.env.PORT || 3500;
//checking
//Creating a server
// const server = http.createServer((req,res)=>{
//     console.log(req.url,req.method);
//     if(req.url === '/'|| req.url === 'index.html' )
//         {
//             res.statusCode = 200;
//             res.setHeader ('content-type','text/html');
//             let filePath = path.join(__dirname,'views', 'index.html');
//             fs.readFile(filePath, 'utf8',(err,data)=>{
//                 res.end(data)
//             })
//         }
// })

//creating a serve file
const serveFile = async (filePath, contentType, response) => {
  try {
    //if only utf8 is written the images will not be seen in screen
    // const rawData = await fsPromises.readFile(filePath, "utf8");
    const rawData = await fsPromises.readFile(filePath, 
        !contentType.includes('image') ? "utf8" : ''
    );
    //if we do like this only then it will not work for the json file so for jsonfile:\
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(
        filePath.includes('404.html')? 404 : 200
        , { "Content-Type": contentType });
        //not to give 200 statusCode when 404.html is requested
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit('logs', '${err.name} : ${err.message}',errorLog.txt);
    response.statusCode = 500;
    //this is the server error if we could not read the data from the server
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit('log',`${req.url} \t ${req.method}`,'reqLog.txt');
  let extension = path.extname(req.url);

  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "images/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    contentType === "text/html" && req.url === "/" //if the request url is just the /
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/" //the last character in the request url is /
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType == "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  //makes .html extension not required on the browser
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";
  //check files and serve
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    //serving the file
    serveFile(filePath, contentType, res);
  } else {
    //404
    //301 -error
    switch (path.parse(filePath).base) {
      case "old-page.html":
        //handling redirect
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { location: "/" }); //redirecting to the homepage
        res.end();
        break;
      default:
        //serving the 404 response
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
