const {expect} = require("@playwright/test");

class CheckoutCompletePage {
    constructor(page) {
        this.page=page;
        this.completeHeader="//h2[@data-test='complete-header']";
        this.backHomeButton="//button[@data-test='back-to-products']";
    }
    
    async getCompletionMessage() {
        await expect(this.page.locator(this.completeHeader)).toHaveText("Thank you for your order!");
    }
}

module.exports=CheckoutCompletePage;