import puppeteer from "puppeteer";
import fs from "fs";

export const scrapeWebsite = async (url) => {
  console.log("🚀 Launching browser to scrape:", url);
  const browser = await puppeteer.launch({
    headless: true, // set to false if you want to see the browser open
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    console.log("✅ Page loaded. Extracting content...");

    // Extract all visible text from the page
    const textContent = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let text = "";
      while (walker.nextNode()) {
        const t = walker.currentNode.textContent.trim();
        if (t) text += t + " ";
      }
      return text;
    });

    if (textContent.length < 50) {
      console.warn("⚠️ Not much text found — check if your site loads content dynamically.");
    }

    fs.writeFileSync("scrapedData.txt", textContent);
    console.log("📝 Scraped data saved to scrapedData.txt");
    console.log("📄 Preview:", textContent.slice(0, 300) + "...");

    await browser.close();
    return textContent;
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    await browser.close();
  }
};


  const URL = "https://aspro-it-frontend.vercel.app/";
  scrapeWebsite(URL);
