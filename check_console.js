import puppeteer from "puppeteer";

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        page.on("console", (msg) => {
            console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });

        page.on("pageerror", (err) => {
            console.log(`[BROWSER ERROR] ${err.toString()}`);
        });

        console.log("Navigating to http://localhost:5173...");
        await page.goto("http://localhost:5173", { waitUntil: "networkidle2", timeout: 10000 });

        // Wait a bit to let React render
        await new Promise(r => setTimeout(r, 2000));

        const content = await page.content();
        if (content.includes("Loading...")) {
            console.log("Found 'Loading...' text on page.");
        }

        await browser.close();
    } catch (err) {
        console.error("Puppeteer Script Error:", err);
    }
})();
