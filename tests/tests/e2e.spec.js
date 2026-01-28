const { test, expect } = require ('@playwright/test');
const LoginPage = require("../pages/loginpage");
const InventoryPage = require("../pages/inventorypage");
const CartPage = require("../pages/cartpage");

test('Успешный логин и проверка страницы товаров', async ({ page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.getPageTitle();
});

test('Пользователь не должен войти в систему', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');
    const errorMessage = page.locator(loginPage.errorMessage);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com');
})

test('Добавление товара в корзину и переход в корзину', async ({page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.getPageTitle();
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.openCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
})

test ('Проверка товара в корзине и переход к оформлению заказа', async ({page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.openCart();
    await cartPage.expectItemInCart('Sauce Labs Fleece Jacket');
    await cartPage.goToCheckout();
})