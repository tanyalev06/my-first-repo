const {expect} = require("@playwright/test");

class InventoryPage {
    constructor(page) {
        this.page=page;
        this.pagetitle = "//span[@class='title']";
        this.itemname = "//div[@data-test='inventory-item-name']";
        this.addtocartbutton = "//button[contains(@class,'btn_inventory')]";
        this.shoppingcardlink = "//a[@class='shopping_cart_link']";
    }

    async addItemToCart(itemName) {
        const addToCartButton = `//div[@class='inventory_item'][.//div[normalize-space()='${itemName}']]//button`;
        await this.page.click(addToCartButton);
    }


    async openCart() {
        await this.page.click(this.shoppingcardlink);

    }

    async getPageTitle() {
        await expect(this.page.locator(this.pagetitle)).toBeVisible();
    }
}

module.exports = InventoryPage;