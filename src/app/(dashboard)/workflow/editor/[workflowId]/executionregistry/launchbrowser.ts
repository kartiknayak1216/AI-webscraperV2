import puppeteer from "puppeteer";
import { EnvironmentExecution } from "./type";
import { LaunchBrowser } from "../../_task/launchbrowser";
import { LogLevel } from "./type"; 
import chromium from '@sparticuz/chromium-min';
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';

export default async function LaunchBrowserExecution(
  environment: EnvironmentExecution<typeof LaunchBrowser>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");

    if (!websiteUrl) {
      environment.setLog("Website URL is required but not provided.", LogLevel.ERROR);
      return false;
    }
let browser

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      // Configure the version based on your package.json (for your future usage).
      const executablePath = await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar')
      browser = await puppeteer.launch({
        executablePath,
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport
      })
    }
else{
     browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
       });
      }

    if (!browser) {
      
      environment.setLog("Failed to launch Puppeteer browser.", LogLevel.ERROR);
      return false;
    }

    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    environment.setPage(page);
    environment.setLog(`Successfully navigated to ${websiteUrl}`, LogLevel.INFO);

    return true;
  } catch (error:any) {
    console.error("An error occurred in LaunchBrowserExecution",error)
    environment.setLog(
      `An error occurred in LaunchBrowserExecution: ${error.message}`,
      LogLevel.ERROR
    );
    return false;
  }
}
