const { test, expect } = require ('@playwright/test');
const LoginPage = require("./pages/loginpage");
const InventoryPage = require("./pages/inventorypage");
const CartPage = require("./pages/cartpage");
const CheckoutStepOnePage = require("./pages/checkoutsteponepage");
const CheckoutStepTwoPage = require("./pages/checkoutsteptwopage");
const CheckoutCompletePage = require("./pages/checkoutcompletepage");

test('Проверка работы с корзиной заказов от логина до совершения заказа', async ({ page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    /*Успешный логин и проверка страницы товаров */
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await inventoryPage.getPageTitle();

    /*Добавление товара в корзину и переход в корзину*/
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.openCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    /*Проверка товара в корзине и переход к оформлению заказа */
    await cartPage.expectItemInCart('Sauce Labs Fleece Jacket');
    await cartPage.goToCheckout();

    /*Оормление заказа (шаг 1: ввод данных)*/
    await checkoutStepOnePage.fillUserInfo('Tatyana', 'Levchenko', '220055');

    /*Завершение покупки*/
    await checkoutStepTwoPage.finishCheckout();

    /*Проверка успешного оформления заказа */
    await checkoutCompletePage.getCompletionMessage();
});