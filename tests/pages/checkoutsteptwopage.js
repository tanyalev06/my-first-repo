const { expect } = require("@playwright/test");

class CheckoutStepTwoPage {
    constructor(page) {
        this.page=page;
        this.summaryInfo="//div[@class='summary_info']";
        this.summaryTotal="//div[@data-test='total-label']";
        this.finishButton = "//button[@data-test='finish']";
        this.cancelButton = "//button[@data-test='cancel']";
    }

    async finishCheckout() {
        await expect(this.page.locator(this.summaryInfo)).toBeVisible();
        await expect(this.page.locator(this.summaryTotal)).toBeVisible();
        await this.page.click(this.finishButton);
    }
}

module.exports = CheckoutStepTwoPage;