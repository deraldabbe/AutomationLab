const { Builder, By, Key, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const assert = require("assert");

let driver;

beforeEach(async () => {
  const chromeOptions = new Options().addArguments("--headless"); 
  driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();
  await driver.get("http://localhost:3000/"); 
});

afterEach(async () => {
  await driver.quit(); 
});

test("can cross off a movie", async () => {
  const movieTitle = "Avengers: Endgame"; 


  const movieElement = await driver.findElement(By.xpath(`//li[contains(text(), "${movieTitle}")]`));


  await movieElement.click();


  const isCrossedOff = await movieElement.getAttribute("class").then(className => className.includes("crossed-off"));
  assert.strictEqual(isCrossedOff, true, "The movie should be crossed off");
});

test("can delete a movie", async () => {
  const movieTitle = "The Shawshank Redemption"; 


  const deleteButton = await driver.findElement(
    By.xpath(`//li[contains(text(), "${movieTitle}")]//button[contains(@class, "delete-button")]`)
  );


  await deleteButton.click();


  await driver.wait(until.stalenessOf(deleteButton));


  const isMoviePresent = await driver.findElements(By.xpath(`//li[contains(text(), "${movieTitle}")]`)).then(elements => elements.length > 0);
  assert.strictEqual(isMoviePresent, false, "The movie should be deleted");
});

test("notifications are displayed", async () => {

  const newMovieTitle = "Inception";
  const addMovieInput = await driver.findElement(By.id("add-movie-input"));
  await addMovieInput.sendKeys(newMovieTitle, Key.RETURN);

 
  const notification = await driver.findElement(By.xpath(`//div[contains(@class, "notification")]`));
  await driver.wait(until.elementIsVisible(notification));


  const isNotificationDisplayed = await notification.isDisplayed();
  assert.strictEqual(isNotificationDisplayed, true, "The notification should be displayed");
});
