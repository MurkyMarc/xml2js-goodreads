const express = require('express');
const key = process.env['key'];
const cors = require('cors');
const app = express();
const axios = require('axios');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.get('/search', async (req, res) => {

  // Parse the request and construct the forwarded request
  // If an empty request is sent, update the request
  const query = req.query.q !== undefined ? req.query.q.replace(/ /g,"+") : "nothing+to+see+here";
  const page = req.query.page !== undefined ? req.query.page : 1;
  const request = "https://www.goodreads.com/search/index.xml?key=" + key + "&q=" + query + "&page=" + page;

  let bookList = [];
  let extractedData;

  try {
    const response = await axios.get(request);

    // parse the xml for the array of books
    parser.parseString(response.data, (err, result) => {
      extractedData = result['GoodreadsResponse']['search']['results']['work'];
    });

    // create the list of books response object
    extractedData.forEach(element => {
      bookList.push({
        id: element.best_book.id._,
        title: element.best_book.title,
        author: element.best_book.author.name,
        image: element.best_book.small_image_url
      });
    });

    res.setHeader("Content-Type","application/json");
    res.send(JSON.stringify(bookList));

  } catch(e){
    res.send({});
  }
});

app.listen(3000, () => {
  console.log('server started');
});
