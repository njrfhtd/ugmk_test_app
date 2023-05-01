import {action, makeObservable, observable} from "mobx";

class AppStore {
    data = undefined;
    loadingData = undefined;
    loadingDataError = undefined;
    productKeysOptions = [
        {
            label: 'Все продукты',
            value: 'all',
            visible: true,
            detailsVisible: false,
        },
        {
            label: 'Продукт 1',
            value: 'product1',
            visible: true,
            detailsVisible: true,
        },
        {
            label: 'Продукт 2',
            value: 'product2',
            visible: true,
            detailsVisible: true,
        },
        {
            label: 'Продукт 3',
            value: 'product3',
            visible: false,
            detailsVisible: false,
        },
    ];
    productNames = {
        product1: 'Продукт 1',
        product2: 'Продукт 2',
        product3: 'Продукт 3',
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
    factories = {
        1: {
            name: 'А',
            color: '#FE0000',
        },
        2: {
            name: 'Б',
            color: '#0001F9',
        },
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
            setData: action,
            setLoadingData: action,
            setLoadingDataError: action,
            data: observable,
            loadingData: observable,
            loadingDataError: observable,
        });
    }

    setData(data) {
        this.data = data;
    }

    setLoadingData(loadingData) {
        this.loadingData = loadingData;
    }

    setLoadingDataError(loadingDataError) {
        this.loadingDataError = loadingDataError;
    }

    refactoringData(rawData) {
        const months = [...Array(12).keys()].map(v => v);
        const data = {};
        months.forEach((month) => {
            if (data[month] === undefined) {
                data[month] = {};
            }
            Object.keys(this.factoryNames).forEach((factory_id) => {
                if (data[month][factory_id] === undefined) {
                    data[month][factory_id] = {};
                }
                Object.keys(this.productNames).forEach((product_id) => {
                    if (data[month][factory_id][product_id] === undefined) {
                        data[month][factory_id][product_id] = 0;
                        data[month][factory_id]['all'] = 0;
                    }
                });
            });
        });
        rawData.forEach((value) => {
            if (!!value.date) {
                const valueMonth = Number(value.date.split('/')[1]);
                if (!isNaN(valueMonth)) {
                    const valueFactoryId = value.factory_id;
                    if (valueFactoryId !== null && valueFactoryId !== undefined) {
                        Object.keys(this.productNames).forEach((product_id) => {
                            data[valueMonth - 1][valueFactoryId][product_id] += Number(value[product_id] || 0);
                            data[valueMonth - 1][valueFactoryId]['all'] += Number(value[product_id] || 0);
                        });
                    }
                }
            }
        });
        this.setData(data);
    }

    loadData() {
        if (window.location.pathname !== '/') {
            window.location.pathname = '/';
            return;
        }
        this.setLoadingData(true);
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
                this.refactoringData(response.data);
                this.setLoadingData(false);
                this.setLoadingDataError(response.error);
            })
            .catch((error) => {
                this.setLoadingDataError({
                    status: null,
                    statusText: 'Системная ошибка'
                });
                this.setLoadingData(false);
                console.error(error.message);
            });
    }
}

export const appStore = new AppStore();
