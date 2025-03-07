const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
///////////////////////////////////
//FILES

//Blocking, synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the Avocado: ${textIn}.\nCreated on ${Date.now()} `;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log("File written");
//Non-blocking, asynchronous way
// fs.readFile('./starter/txt/startt.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');
//   fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./starter/txt/final.txt',`${data2}\n${data3}`, 'utf-8', err => {
//         console.log("File written");
//       });
//     });
//   });
// });
// console.log('Will read file!');

///////////////////////////////////
//Server

// Read templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
//Read data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// Create Server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text.html',
    });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    const idString = query.id.replace(/[{}]/g, ''); // Remove curly braces
    const id = parseInt(idString, 10); // Parse the string as a base-10 integer

    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }

  // NOT FOUND
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello-world',
    });
    res.end('<h1>404 Page not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
