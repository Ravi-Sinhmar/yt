const puppeteer = require("puppeteer");
require("dotenv").config();

// Getting Users Bio/Profile Details
const profile = async (res) => {

  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      // "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  const iPhone = puppeteer.KnownDevices['iPhone 14 Pro Max'];
  await page.emulate(iPhone);

  await page.goto("https://www.instagram.com"); // Replace with the actual URL
  
  // Wait for the article element
  const article = await page.waitForSelector('article');

  
  // Function to handle login
  const data = await article.evaluate(async (article) => {
    let finalData = null;
    // Delay function
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let count = 0;
    while (true) {
      const allButtons = article.querySelectorAll('button , a');
      console.log('allButtons', allButtons);
      
      const loginLinks = Array.from(allButtons).filter(link => 
        link.textContent.toLowerCase().replace(" ", "").includes('login')
      );

      if (loginLinks.length > 0 || count > 10) {
        if (loginLinks.length > 0) {
          finalData = loginLinks[0].innerText;
          console.log("Login link found: ", loginLinks[0]);
        }
        break;
      } 

      count++;
      await delay(500); // Await the delay
    }

    return finalData;
  });
  
res.status(200).json("DOne");
 return data;
}
module.exports = profile;
