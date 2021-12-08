const fs = require("fs");
const j2cp = require("json2csv").Parser;
const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://coast.noaa.gov/htdata/CMSP/AISDataHandler/2020/index.html";

//   "http://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

// async function getGenre() {
//   try {
//     const response = await axios.get(url);
//     // Cheerio’s load () method returns a reference to the document, which can be stored in a constant.
//     // This can have any name.
//     //  To make our web scraping code look and feel more like jQuery a $ can be used instead of a name.
//     const $ = cheerio.load(response.data);

//     // the method text() will be used everywhere
//     const genre = $("h1").text();
//     console.log(genre);
//   } catch (error) {
//     console.error(error);
//   }
// }

const https = require("https"); // or 'https' for https:// URLs

const file = fs.createWriteStream("AIS_2020_03_18.zip");
const request = https.get(
  "https://coast.noaa.gov/htdata/CMSP/AISDataHandler/2020/index.html",
  function (response) {
    response.pipe(file);
  }
);

// async function getGenre() {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);
//     const db = $("body > a:nth-child(167)").attr("href");
//     let file = fs.createWriteStream(db);
//     console.log(db, "gg");
//     const res = await axios({
//       url,
//       method: "GET",
//       responseType: "stream",
//     });
//     res.data.pipe(file);
//   } catch (error) {
//     // console.log(db.clic());

//     // db.each(function () {
//     //   title = $(this).find("a").text();
//     //   console.log(title, "here");
//     // });
//     console.error(error);
//   }
// }

// getGenre();
