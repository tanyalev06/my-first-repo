import {test, expect} from '@playwright/test';

test.describe('@api API-тесты для Restful-broker', () => {

    test.describe.configure({mode: 'serial'});

    const baseURL = 'https://restful-booker.herokuapp.com';
    let bookingID; //хранение bookingID, полученного после создания брони
    let authToken;
    const bookingData = {
        "firstname" : "Jim",
        "lastname" : "Brown",
        "totalprice" : 111,
        "depositpaid" : true,
        "bookingdates" : {
            "checkin" : "2018-01-01",
            "checkout" : "2019-01-01"
        },
        "additionalneeds" : "Breakfast"
    };

    //CREATE
    test ('@api Создание нового бронирования', async ({request}) => {
        // Отправляем POST-запрос на создание брони
        const response = await request.post(`${baseURL}/booking`, {
            data: bookingData
        });

        // Проверка 1: Статус-код ответа
        console.log(`Статус-код (POST): ${response.status()}`);
        expect (response.status()).toBe(200);

        // Проверка 2: Получаем тело ответа
        const responseBody = await response.json();
        console.log('Тело ответа POST', responseBody);

        // Проверка 3: В ответе есть объекты с ключом 'bookingid'
        expect(responseBody).toHaveProperty('bookingid');

        // Проверка 4: Данные в ответе совпадают с отправленными
        expect(responseBody.booking.firstname).toBe(bookingData.firstname);
        expect(responseBody.booking.lastname).toBe(bookingData.lastname);
        expect(responseBody.booking.totalprice).toBe(bookingData.totalprice);
        expect(responseBody.booking.depositpaid).toBe(bookingData.depositpaid);
        expect(responseBody.booking.bookingdates).toEqual(bookingData.bookingdates);
        expect(responseBody.booking.additionalneeds).toBe(bookingData.additionalneeds);

        // Cохраняем ID для последующих тестов
        bookingID = responseBody.bookingid;
    });

    //READ
    test ('@api Получение информации о бронировании', async ({request}) => {
        const response = await request.get(`${baseURL}/booking/${bookingID}`/*, {
            headers: {
                Accept: 'application/json'
            }
        }*/);

        // Отправляем GET-запрос
        console.log(`Статус-код GET: ${response.status()}`);
        expect (response.status()).toBe(200);

        // Проверка 1: Получаем тело ответа
        const responseBody = await response.json();
        console.log('Ответ GET:', responseBody);

        // Проверка 2: Данные бронирования соответствуют созданным
        expect(responseBody.firstname).toBe(bookingData.firstname);
        expect(responseBody.lastname).toBe(bookingData.lastname);
        expect(responseBody.totalprice).toBe(bookingData.totalprice);
        expect(responseBody.depositpaid).toBe(bookingData.depositpaid);
        expect(responseBody.bookingdates).toEqual(bookingData.bookingdates);
        expect(responseBody.additionalneeds).toBe(bookingData.additionalneeds);
    })
    
    //UPDATE
    test ('@api Обновление бронирования', async ({request}) => {
        //Получение токена авторизации
        const authResponse = await request.post(`${baseURL}/auth`, {
            data: {
                username: "admin",
                password: "password123"
            }
        });
        const {token} = await authResponse.json();
        authToken = token;
        console.log('Токен авторизации:', token);

        //Данные для обновления
        const updateBooking = {
            ...bookingData,
            totalprice: 222
        }

        //Отправление PUT-запроса на обновление брони
        const response = await request.put(`${baseURL}/booking/${bookingID}`, {
            data: updateBooking,
            headers: {
                Cookie: `token=${token}`,
                Accept: 'application/json'
            }
        });
        console.log(`Статус-код PUT: ${response.status()}`);
        expect(response.status()).toBe(200);

        // Проверка 1: Получаем тело ответа
        const responseBody = await response.json();
        console.log('Ответ PUT:', responseBody);

        // Проверка 2: Данные бронирования обновлены
        expect(responseBody.totalprice).toBe(updateBooking.totalprice);
    });

    test ('@api Удаление бронирования', async ({request}) => {
        // Отправляем DELETE запрос с токеном
        const response = await request.delete(`${baseURL}/booking/${bookingID}`, {
             headers: { Cookie: `token=${authToken}` }
        });

        //Проверка 1: Статус-код ответа равен 201 Created
        console.log(`Статус-код DELETE: ${response.status()}`);
        expect(response.status()).toBe(201);

        //Проверка2: Cервер отвечает со статус-кодом 404 Not Found
        const getResponse = await request.get(`${baseURL}/booking/${bookingID}`, {
            headers: {Accept: 'application/json'}
        });

        console.log(`Статус-код GET после DELETE: ${getResponse.status()}`);
        expect(getResponse.status()).toBe(404);
    })
});