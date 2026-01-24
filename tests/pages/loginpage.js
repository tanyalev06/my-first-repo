class LoginPage {
    constructor(page) {
        this.page=page;
        this.username='#user-name';
        this.password='#password';
        this.loginButton='#login-button';
        this.errorMessage ='[data-test="error"]';
    }

    async open() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.page.fill(this.username, username);
        await this.page.fill(this.password, password);
        await this.page.click(this.loginButton);
    }
}

module.exports=LoginPage;