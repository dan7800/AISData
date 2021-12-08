const fs = require("fs");
const j2cp = require("json2csv").Parser;
const cheerio = require("cheerio");
const axios = require("axios");
const mystery =
  "http://books.toscrape.com/catalogue/category/books/mystery_3/index.html";
const books_data = [];

async function getBooks(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const books = $("article");
    books.each(function () {
      title = $(this).find("h3 a").text();
      price = $(this).find(".price_color").text();
      stock = $(this).find(".availability").text().trim();
      books_data.push({ title, price, stock }); //store in array
      const parser = new j2cp();
      const csv = parser.parse(books_data);
      fs.writeFileSync("/Users/macc/Documents/books.zip", csv);
    });
    console.log(books_data); //print the array
  } catch (err) {
    console.error(err);
  }
}
getBooks(mystery);
