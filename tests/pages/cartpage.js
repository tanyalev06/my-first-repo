const {expect} = require("@playwright/test");

class CartPage {
    constructor(page) {
        this.page=page;
        this.checkoutButton="//button[@data-test='checkout']";
        this.continueShoppingButton = "//button[@data-test='continue-shopping']";
        this.cartItem = "//div[@class='cart_item']";
    }

    async expectItemInCart(itemname) {
        await expect(this.page.locator(this.cartItem).filter({hasText: itemname})).toBeVisible();
    }

    async goToCheckout(itemname) {
        await this.page.click(this.checkoutButton);
    }

    async goToContinueShopping () {
        await this.page.click(this.continueShoppingButton);
    }
}

module.exports = CartPage;