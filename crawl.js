const puppeteer = require("puppeteer");
const http = require("https");
const fs = require("fs");
const extract = require("extract-zip");

const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
});

// connect to database
async function connectDB() {
  try {
    await client.connect();
  } catch (error) {
    console.log("db not connected");
  }
}

const FILE_PATH = "/Users/macc/Downloads/tables/";

// Scrap the links for the files on the website
async function scrapLinks() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://marinecadastre.gov/ais/");

    const scrappedLinks = await page.evaluate(() => {
      let links = [];
      const years = document.querySelectorAll(
        ".panel.panel-default.ng-scope.ng-isolate-scope"
      );
      const yearsLength = years.length;
      const year_2020 = years[yearsLength - 2];
      year_2020.querySelectorAll("div > ul > li > a").forEach((a) => {
        const link = a.href;
        if (link.toString().endsWith(".zip")) {
          links.push(link);
        }
      });
      return links;
    });

    await browser.close();

    return scrappedLinks;
  } catch (err) {
    console.log(err);
    console.log("error visiting page");
  }
}

// get the month and year from the downloads
function getDBFromFileName(fileName) {
  const partsArr = fileName.split("_"); //['AIS', '2020', '01', '01.csv']
  const year = partsArr[1];
  const monthNum = partsArr[2];
  const monthMap = {
    "01": "january",
    "02": "february",
    "03": "march",
    "04": "april",
    "05": "may",
    "06": "june",
    "07": "july",
    "08": "august",
    "09": "september",
    10: "october",
    11: "november",
    12: "december",
  };

  const month = monthMap[monthNum];
  return `${month}_${year}`;
}

// automaticaly download the files from links
async function downloadFilesFromLinks(linkw) {
  const links = linkw.slice(0, 60);

  function downloadFile(fileName, link) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(`${FILE_PATH}${fileName}`);
      http.get(link, function (response) {
        response.pipe(file).on("close", () => resolve(fileName));
      });
    });
  }

  //   automatically unzip the file
  async function unzipFile(fileName) {
    await extract(`${FILE_PATH}${fileName}`, {
      dir: `${FILE_PATH}`,
    });
  }

  //   delete zip files after unzipping
  function cleanUpZipFile(fileName) {
    fs.unlink(`${FILE_PATH}${fileName}`, () => {});
  }

  //   perform the functions
  for (const link of links) {
    try {
      const linkComponents = link.split("/");
      const fileName = linkComponents[linkComponents.length - 1];
      await downloadFile(fileName, link);
      await unzipFile(fileName);
      cleanUpZipFile(fileName);
      console.log(fileName, "about to insert");
      insertDataToDb(fileName);

      console.log(`${fileName} inserted`);
    } catch (err) {
      console.error(err);
    }
  }
}

async function createTableifNotInExistence(tableName) {
  try {
    await client.query(
      `create table if not exists ${tableName}(
			mmsi bigint    not null,
			basedatetime     timestamp not null,
			lat              numeric,
			lon              numeric,
			sog              numeric,
			cog              numeric,
			heading          numeric,
			vesselname       varchar,
			imo              varchar(100),
			callsign         varchar(100),
			vesseltype       integer,
			status           integer,
			length           integer,
			width            integer,
			draft            numeric,
			cargo            integer,
			transceiverclass varchar(100)	
  );
		`
    );
  } catch (error) {
    console.error(error);
    console.error("table not created");
  }
}

async function insertDataToDb(filename) {
  try {
    const csvFileName = filename.replace(".zip", ".csv");

    const tablename = getDBFromFileName(filename);
    await createTableifNotInExistence(tablename);

    await client.query(
      `COPY ${tablename} FROM '${FILE_PATH}${csvFileName}' DELIMITER ',' CSV HEADER;`
    );
  } catch (error) {
    console.error(error);
  }
}

//  run all the process
async function doStuff() {
  try {
    await connectDB();
    const links = await scrapLinks();
    console.log("All links scrapped");
    await downloadFilesFromLinks(links);
  } catch (err) {
    console.error("error doing stuff");
  }
}

doStuff()
  .then(() => console.log("Process completed"))
  .catch((err) => console.log(err));
