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

  await page.click("#signupbtn");

  //user twill provide email/password to sign up

  await page.type("#firstname", "Lauren");
  await page.type("#lastname", "Roskopf");
  await page.type("#email", "test@test.com");
  await page.type("#phonenumber", "2621112222");
  await page.type("#password", "test1234");

  //user clicks on the submit button

  await page.click(
    "#signup_form > div.field.is-grouped > div.control > button"
  );

  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));

  //test clicking on product
  await page.click("#pennantspg");

  //  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));
  //   //selecting options for pennant

  await page.type("#penPersonal", "Testing");

  //   //submit order
  await page.click("#addPennant");
  //set 2 delay
  await new Promise((r) => setTimeout(r, 2000));

  //checking shopping cart
  await page.click("#shoppingCart > i");

  //delete item fron shopping cart
  await page.click("#cart > div:nth-child(1) > div.is-clickable > i");

  browser.close();
}

go();
