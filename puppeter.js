const puppeteer = require('puppeteer');
require('dotenv').config();

const selectedOptionValue = "6059";
const delayBetweenIterations = 300; // 5 seconds delay

async function tryLogin(page) {
  console.log('Trying to login...');

  // Replace 'your_username' and 'your_password' with your actual username and password
  const username = 'a100569';
  const password = process.env.PASS || 'default_password';;

  // Wait for the form to be rendered
  await page.waitForSelector('form.login-form');

  // Updated selectors based on the provided HTML structure
  await page.$eval('input#username', (el, value) => el.value = value, username);
  await page.$eval('input#password', (el, value) => el.value = value, password);

  // Assuming the login form has a button for submitting the form
  await page.click('button#loginbtn');

  console.log('Login successful!');
}

async function automateFormSubmission() {
  const browser = await puppeteer.launch({ headless: false }); // Launch the browser with GUI
  const page = await browser.newPage();

  try {
    await page.goto('https://moodle.dsi.uminho.pt/mod/choice/view.php?id=30672');

    // Call the login function before navigating to the form
    await tryLogin(page);
    
    while (true) {
      console.log('Navigating to the webpage...');
      
      // Wait for the form to be rendered
      await page.waitForSelector('form');

      console.log('Selecting the desired option...');
      await page.evaluate((selectedOptionValue) => {
        const radioButton = document.querySelector(`input[name="answer"][value="${selectedOptionValue}"]`);
        if (radioButton) {
          radioButton.click();
        } else {
          console.error('The desired option was not found.');
          return;
        }
      }, selectedOptionValue);

      console.log('Submitting the form...');
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          form.submit();
        }
      });

      console.log('Form submitted successfully!');

      // Add a delay between iterations
      await new Promise(resolve => setTimeout(resolve, delayBetweenIterations));
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    console.log('Closing the browser...');
    await browser.close();
  }
}

// Call the function to automate form submission
automateFormSubmission();
