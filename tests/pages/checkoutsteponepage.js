class CheckoutStepOnePage {
    constructor(page) {
        this.page=page;
        this.firstName="//input[@data-test='firstName']";
        this.lastName="//input[@data-test='lastName']";
        this.postalCode="//input[@data-test='postalCode']";
        this.continueButton="//input[@data-test='continue']";
    }

    async fillUserInfo(firstName, lastName, postalCode) {
        await this.page.fill(this.firstName, firstName);
        await this.page.fill(this.lastName, lastName);
        await this.page.fill(this.postalCode, postalCode);
        await this.page.click(this.continueButton);
    }
}

module.exports = CheckoutStepOnePage;