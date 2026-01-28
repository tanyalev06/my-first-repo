const {expect} = require("@playwright/test");

class CartPage {
    constructor(page) {
        this.page=page;
        this.buttonCheckout="//button[contains(@class,'btn_action')]";
    }

    async goToCheckout(itemname) {
        const itemXpath = `//div[@class='cart_item'][.//div[normalize-space()='${itemname}']]`
        await expect(this.page.locator(itemXpath)).toBeVisible();
        await this.page.click(this.buttonCheckout);
    }
}

module.exports = CartPage;