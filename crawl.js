const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    }
  }
  return urls;
}

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

async function crawlpage(currentURL, baseURL, pages) {
  try {
    const currentHost = new URL(currentURL).hostname;
    const baseHost = new URL(baseURL).hostname;
    if (currentHost !== baseHost) {
      console.log("Skipping URL from a different domain:", currentURL);
      return pages;
    }

    const normalizedURL = normalizeURL(currentURL);

    if (pages[normalizedURL]) {
      pages[normalizedURL]++;
      return pages;
    }

    pages[normalizedURL] = baseURL === currentURL ? 0 : 1;

    const resp = await fetch(currentURL);
    if (resp.status >= 400) {
      console.log(`Failed to fetch webpage. Status: ${resp.status} ${resp.statusText}`);
      return pages;
    }

    console.log(`Crawling: ${currentURL}`);
    const htmlBody = await resp.text();
    const urls = getURLsFromHTML(htmlBody);
    for (const url of urls) {
      pages = await crawlpage(url, baseURL, pages);
    }

    return pages;
  } catch (error) {
    console.error(`Error crawling webpage ${currentURL}: ${error.message}`);
    return pages;
  }
}

    

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlpage,
};
