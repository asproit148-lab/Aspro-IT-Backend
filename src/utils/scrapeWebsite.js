import puppeteer from "puppeteer";
import fs from "fs";

export const scrapeWebsite = async (url) => {
  console.log("🚀 Launching browser to scrape:", url);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    // Set viewport for better rendering
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, { 
      waitUntil: "networkidle0", // Wait for all network requests
      timeout: 60000 
    });
    
    // Wait for React/dynamic content to render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("✅ Page loaded. Extracting content...");

    // Scroll to load lazy-loaded content
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Extract comprehensive content
    const pageData = await page.evaluate(() => {
      // Remove script, style, and hidden elements
      const elementsToRemove = document.querySelectorAll(
        'script, style, noscript, iframe, [hidden], [style*="display: none"]'
      );
      elementsToRemove.forEach(el => el.remove());

      // Get title
      const title = document.title || '';
      
      // Get meta description
      const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
      
      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => h.textContent.trim())
        .filter(Boolean);
      
      // Get all paragraphs and text content
      const paragraphs = Array.from(document.querySelectorAll('p, li, td, th, span, div, a'))
        .map(el => el.textContent.trim())
        .filter(text => text.length > 10); // Filter out very short snippets
      
      // Get links
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({
          text: a.textContent.trim(),
          href: a.href
        }))
        .filter(link => link.text.length > 0);

      // Get all visible text as fallback
      const bodyText = document.body.innerText || document.body.textContent;

      return {
        title,
        metaDesc,
        headings: [...new Set(headings)], // Remove duplicates
        paragraphs: [...new Set(paragraphs)],
        links,
        bodyText: bodyText.replace(/\s+/g, ' ').trim()
      };
    });

    // Format the scraped data
    let formattedContent = `WEBSITE: ${url}\n\n`;
    formattedContent += `TITLE: ${pageData.title}\n\n`;
    
    if (pageData.metaDesc) {
      formattedContent += `DESCRIPTION: ${pageData.metaDesc}\n\n`;
    }
    
    formattedContent += `HEADINGS:\n${pageData.headings.join('\n')}\n\n`;
    formattedContent += `CONTENT:\n${pageData.paragraphs.join('\n')}\n\n`;
    formattedContent += `NAVIGATION LINKS:\n${pageData.links.map(l => `${l.text}: ${l.href}`).join('\n')}\n\n`;
    formattedContent += `FULL TEXT:\n${pageData.bodyText}`;

    // Save to file
    fs.writeFileSync("scrapedData.txt", formattedContent);
    console.log("📝 Scraped data saved to scrapedData.txt");
    console.log(`📊 Stats: ${pageData.headings.length} headings, ${pageData.paragraphs.length} paragraphs, ${pageData.links.length} links`);
    console.log("📄 Preview:", formattedContent.slice(0, 500) + "...");

    await browser.close();
    return formattedContent;
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    await browser.close();
    throw error;
  }
};

const URL = "https://aspro-it-frontend.vercel.app/";
// const URL = "http://localhost:5173/";
scrapeWebsite(URL);