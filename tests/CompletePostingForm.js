const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const path = require('path'),
    fs = require('fs');

const driver = new webdriver.Builder().forBrowser('chrome').build();

let uri = 'http://127.0.0.1:8080';

driver.get(uri + '/contas/login');
driver.manage().window().maximize();
driver.findElement(By.id('login_username')).sendKeys('barezani@usa.com');
driver.findElement(By.id('login_password')).sendKeys('senha123');
driver.findElement(By.id('login_password')).sendKeys(webdriver.Key.ENTER);
driver.wait(until.elementLocated(By.className('accountBtn')));
driver.navigate().to(uri + '/anuncios/novo');
driver.findElement(By.id('prodServ-2')).click();
driver.findElement(By.id('txtBoxTitle')).sendKeys('Pneu');
driver.findElement(By.id('postTextArea')).sendKeys('fiat uno');
driver.findElement(By.id('condition-1')).click();
driver.findElement(By.id('priority-0')).click();
driver.findElement(By.id('priority-1')).click();
driver.findElement(By.id('btnLocales')).click();
driver.wait(until.elementLocated(By.className('select2-search__field')));
driver.findElement(By.className('select2-search__field')).sendKeys('minas gerais');
driver.sleep(1500);
driver.findElement(By.className('select2-search__field')).sendKeys(webdriver.Key.ENTER);
driver.wait(until.elementLocated(By.className('select2-search__field')));
driver.findElement(By.className('select2-search__field')).sendKeys('governador valadares');
driver.sleep(1500);
driver.findElement(By.className('select2-search__field')).sendKeys(webdriver.Key.ENTER);
driver.sleep(1000);
driver.findElement(By.id('txtBoxLocaleQty')).click();
driver.findElement(By.id('txtBoxLocaleQty')).sendKeys('1');
driver.sleep(1000);
driver.findElement(By.id('btnAddLocale')).click();
driver.sleep(1000);
driver.findElement(By.xpath('//*[@id="localesModal"]/div/div/div[1]/button')).click();
driver.sleep(1000);
driver.findElement(By.id('txtBoxExpiryDate')).click();
driver.findElement(By.id('txtBoxExpiryDate')).sendKeys('23/06/2017');

let filename = 'bigger_logo.png';
let filePath = path.join(process.cwd() + '\\process\\img\\', filename);
driver.findElement(By.xpath('//input[@type="file"]')).sendKeys(filePath);

// driver.sleep(1000);
// driver.findElement(By.id('btnSavePost')).click();

// driver.findElement(By.id('login_username')).sendKeys('barezani@usa.com');
// driver.findElement(By.id('login_username')).sendKeys('barezani@usa.com');
// driver.quit();

// const driver = new Builder().withCapabilities({
//     browserName: 'chrome',
//     'chromeOptions': {
//         args: [
//             'test-type',
//             '-allow-running-insecure-content'
//         ],
//         excludeSwitches: ["ignore-certificate-errors"]
//     }
// }).build();