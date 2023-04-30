import {action, makeObservable, observable} from "mobx";

class AppStore {
    products = undefined;
    details = undefined;
    loadingProducts = false;
    loadingProductsError = undefined;
    productKeysOptions = [
        {
            label: 'Все продукты',
            value: undefined,
            visible: true,
        },
        {
            label: 'Продукт 1',
            value: 'product1',
            visible: true,
        },
        {
            label: 'Продукт 2',
            value: 'product2',
            visible: true,
        },
        {
            label: 'Продукт 3',
            value: 'product3',
            visible: false,
        },
    ];
    productNames = {
        product1: 'Продукт 1',
        product2: 'Продукт 2',
        'product3': 'Продукт 3',
    };
    productColors = {
        product1: '#008000',
        product2: '#fea500',
        product3: '#0077ff',
    };
    factoryNames = {
        1: 'А',
        2: 'Б',
    };
    humanMonths = {
        0: 'Янв',
        1: 'Фев',
        2: 'Мар',
        3: 'Апр',
        4: 'Май',
        5: 'Июн',
        6: 'Июл',
        7: 'Авг',
        8: 'Сен',
        9: 'Окт',
        10: 'Ноя',
        11: 'Дек',
    };

    constructor() {
        makeObservable(this, {
            loadProducts: action,
            products: observable,
            details: observable,
            loadingProducts: observable,
            loadingProductsError: observable,
        });
    }

    setProducts(products) {
        this.products = products;
    }

    setDetails(details) {
        this.details = details;
    }

    setLoadingProducts(loadingProducts) {
        this.loadingProducts = loadingProducts;
    }

    setLoadingProductsError(loadingProductsError) {
        this.loadingProductsError = loadingProductsError;
    }

    loadProducts() {
        if (window.location.pathname !== '/') {
            window.location.pathname = '/';
            return;
        }
        this.setLoadingProducts(true);
        fetch(process.env.REACT_APP_API_URL)
            .then(async (response) => {
                let responseData;
                let responseDataParseError = false;
                try {
                    responseData = await response.json();
                } catch (e) {
                    responseDataParseError = true;
                }
                return {
                    error: response.ok && !!responseData ? undefined : (!responseDataParseError ? response : {
                        status: 500,
                        statusText: 'Системная ошибка'
                    }),
                    data: response.ok && !!responseData ? responseData : undefined,
                };
            })
            .then((response) => {
                this.setProducts(response.data);
                this.setLoadingProducts(false);
                this.setLoadingProductsError(response.error);
            })
            .catch((error) => {
                this.setLoadingProductsError(error);
                this.setLoadingProducts(false);
                console.error(error.message);
            });
    }
}

export const appStore = new AppStore();
