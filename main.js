const crawl = require("./crawl");

function main() {
  const baseURL = process.argv.slice(2);

  if (baseURL.length !== 1) {
    console.log("Please provide exactly one command-line argument.");
    return;
  } else {
    const url = `https://${baseURL[0]}`; // Prepend "https://" to the URL
    console.log(`The crawler is doing its work on ${url}`);
    const pages ={}
    crawl.crawlpage(url,url,pages); 
    console.log(pages);
  }
}

main();
