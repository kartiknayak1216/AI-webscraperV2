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
    let browser;

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      console.log("Running in production environment.");
      try {
        const executablePath = await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
        );
        console.log("Chromium executable path:", executablePath);

        browser = await puppeteer.launch({
          executablePath,
          args: chromium.args,
          headless: chromium.headless,
          defaultViewport: chromium.defaultViewport,
        });
        console.log("Puppeteer browser launched in production.");
      } catch (error: any) {
        console.error("Failed to launch Puppeteer in production:", error);
        environment.setLog(`Production error: ${error.message}`, LogLevel.ERROR);
        return false;
      }
    } else {
      console.log("Running in development environment.");
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log("Puppeteer browser launched in development.");
      } catch (error: any) {
        console.error("Failed to launch Puppeteer in development:", error);
        environment.setLog(`Development error: ${error.message}`, LogLevel.ERROR);
        return false;
      }
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
