const { test, expect } = require ('@playwright/test');
const LoginPage = require("../pages/loginpage");
const InventoryPage = require("../pages/inventorypage");
const CartPage = require("../pages/cartpage");
const CheckoutStepOnePage = require("../pages/checkoutsteponepage");
const CheckoutStepTwoPage = require("../pages/checkoutsteptwopage");
const CheckoutCompletePage = require("../pages/checkoutcompletepage");

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

test ('Оормление заказа (шаг 1: ввод данных)', async ({page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.openCart();
    await cartPage.expectItemInCart('Sauce Labs Fleece Jacket');
    await cartPage.goToCheckout();
    await checkoutStepOnePage.fillUserInfo('Tatyana', 'Levchenko', '220055');
    /*await checkoutStepOnePage.clickContinue();*/
})

test ('Завершение покупки', async ({page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.openCart();
    await cartPage.expectItemInCart('Sauce Labs Fleece Jacket');
    await cartPage.goToCheckout();
    await checkoutStepOnePage.fillUserInfo('Tatyana', 'Levchenko', '220055');
    await checkoutStepTwoPage.finishCheckout();
})

test ('Проверка успешного оформления заказа', async({page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.openCart();
    await cartPage.expectItemInCart('Sauce Labs Fleece Jacket');
    await cartPage.goToCheckout();
    await checkoutStepOnePage.fillUserInfo('Tatyana', 'Levchenko', '220055');
    await checkoutStepTwoPage.finishCheckout();
    await checkoutCompletePage.getCompletionMessage();
})
