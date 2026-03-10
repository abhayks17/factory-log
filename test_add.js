import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    console.log("Navigating to Workers page...");
    // Mock a logged-in state by setting localStorage before navigation
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
        const demoUser = { id: "demo-admin", name: "Admin", workerId: "admin", department: "HQ", role: "admin" };
        localStorage.setItem("factorylog-auth", JSON.stringify({ state: { user: demoUser, token: "demo", isAuthenticated: true } }));
    });

    await page.goto('http://localhost:5173/admin/workers');
    await page.waitForSelector('text/Workers');

    const rowsBefore = await page.$$eval('tbody tr', rows => rows.length);
    console.log(`Rows before adding: ${rowsBefore}`);

    // Click Add Worker
    await page.click('button:has-text("Add Worker")');
    await page.waitForSelector('text/Add Worker', { visible: true });

    // Fill form
    await page.type('input[placeholder="e.g. WK-106"]', 'WK-999');
    await page.type('input[placeholder="e.g. John Doe"]', 'Test User');

    // Submit
    await page.click('button:has-text("Add Worker")');

    // Wait for modal to hide
    await new Promise(r => setTimeout(r, 1000));

    const rowsAfter = await page.$$eval('tbody tr', rows => rows.length);
    console.log(`Rows after adding: ${rowsAfter}`);

    const firstRowText = await page.$eval('tbody tr:first-child', el => el.textContent);
    console.log(`First row content: ${firstRowText}`);

    await browser.close();
})();
