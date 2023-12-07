//import puppeteer
const puppeteer = require("puppeteer");

async function go() {

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 15,
    });

    const page = await browser.newPage();

    //access the site to be tested 

    await page.goto("https://cheers-to-you-eaa8c.firebaseapp.com/");

    //user click the sign-in button 

    await page.click("#signinbtn");

    //user twill provide email/password to sign in 

    await page.type("#email_", "test@test.com");
    await page.type("#password_", "test1234");

    //user clicks on the submit button 

    await page.click("#signin_form > div.field.is-grouped > div.control > button");

    //test the search functionality 

    //set 2 delay 
    // await new Promise((r) => setTimeout(r, 2000));


    browser.close();
}

go();