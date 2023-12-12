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

  //user will provide email/password to sign up
  await page.type("#email_", "test@test.com");
  await page.type("#password_", "test1234");

  //user clicks on the submit button

  await page.click(
    "#signin_form > div.field.is-grouped > div.control > button"
  );

  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));

  //test clicking on product
  await page.click("#milestonepg");

  //  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));
  //   //selecting options for pennant

  //await page.type("#penPersonal", "Testing");

  //   //submit order
  await page.click("#addMS");
  page.on('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss();
  })
  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));

  //checking shopping cart
  await page.click("#shoppingCart");

  //delete item fron shopping cart
  //await page.click("#cart > div > div.is-clickable");
  //set 2 delay
  await new Promise((r) => setTimeout(r, 5000));

  //sign out
  await page.click("#signoutbtn");
  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));
  //sign in as admin
  await page.click("#signinbtn");

  //enter admin info
  await page.type("#email_", "alice28512@gmail.com");
  await page.type("#password_", "!Admin01");

  await page.click("#buntingspg");

  browser.close();
}

go();
