var fs = require("fs");
const Axios = require("axios");
const cheerio = require("cheerio");

const url = "https://coast.noaa.gov/htdata/CMSP/AISDataHandler/2020/index.html";

// async function getTitle() {
//   try {
//     const response = await Axios.get(url);

//     const $ = cheerio.load(response.data);

//     let title = $("h4").text();
//     console.log(title, "here na");
//   } catch (error) {
//     console.error(error);
//   }
// }
// getTitle();

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return Axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}
downloadFile(
  "https://coast.noaa.gov/htdata/CMSP/AISDataHandler/2020/AIS_2020_01_02.zip",
  `/Users/macc/Downloads/AIS_2020_01_02.zip`
);
