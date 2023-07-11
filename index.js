var express = require("express");
var cors = require("cors");
var app = express();
var axios = require("axios");
var url = require("./models/url");
const fetchReviews = require("./utils/fetchReviews");
const reviews = require("./models/reviews");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
app.use(cors());

fs = require("fs");
var parser = require("xml2json");

let browserApi = require("./utils/browserApi.js");

//read the product list xml and parse to JSON then save into database
// fs.readFile( './xml-sitemap/PRP-3-11.xml', async (err, data)=>{
//     let json = parser.toJson(data);
//     let sitemap = JSON.parse(json)
//     // console.log(sitemap.urlset.url[0])
//     await url.insertMany(sitemap.urlset.url);
//     console.log('done')

//  });

(async () => {
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  let browser = await browserApi.getBrowser();

  // let recordCount = await url.find({}).count();
  // console.log('totalRecords', recordCount);
  for (let i = 0; i < 40000; i++) {
      //get first element which is not done yet
      
    let page = await browser.newPage();
    let productUrl = await url.findOne({ isDone: false });
    console.log(productUrl._id.toString());
    // return;
    let productUrlSplit = productUrl.loc.split("/");

    let listReviews = [];
    let counter = 0;
    let pageSize = 10;
    let totalPages;
    do {
    counter++;
      let pageNo = counter > 1 ? `?pgn=${counter}` : ``;
      let newLocation = `https://ebay.co.uk/urw/product-reviews/${
        productUrlSplit[productUrlSplit.length - 1]
      }${pageNo}`;
      let { allReviews, totalReviews } = await fetchReviews(page, newLocation);
      listReviews.push(...allReviews);
      allReviews.length>0 && await reviews.insertMany(allReviews);
      if (!totalPages)
        totalPages = parseFloat(parseInt(totalReviews) / pageSize);
        console.log("done", counter);
    } while (totalPages > counter);
    await url.findOneAndUpdate(
      { _id: productUrl._id.toString() },
      { isDone: true }
    );
    console.log("length", listReviews.length);
    console.log("done");
    await page.close();
  }

})();

app.listen(8090, function () {
  console.log("CORS-enabled web server listening on port 80");
});
