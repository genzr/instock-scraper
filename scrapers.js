const puppeteer = require ('puppeteer');
const umart = require('./umart.json');
const sendMail = require('./mailer').sendMail

const scrapeProductForInStock = async (urls, xpath, supplier) => {

    const resultsArray = [];

    try {

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });

        for(let i=0; i< urls.length; i++) {
            let url = urls[i];

            const page = await browser.newPage();
            await page.goto(url);
            await page.waitForXPath(xpath);
    
            const [element] = await page.$x(xpath);
        
            const result = await page.evaluate(el => el.textContent, element);
            const resultObj = {
                supplier: supplier,
                scrapedURL: url,
                result
            }

            if (resultObj.result.startsWith("Pre")) {
                console.log(url, " - not in stock");
            } else {
                console.log(url, "is in stock!");
                resultsArray.push(resultObj);
            }

                await page.close();
        }          

        if(resultsArray.length > 0) {
            sendMail(resultsArray);
        }

        await browser.close();

    } catch (err) {
    
        console.log(err);
    }
}

scrapeProductForInStock(umart.urls, umart.xpath, umart.supplier);