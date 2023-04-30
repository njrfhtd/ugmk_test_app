import './Home.css';
import {Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis} from "recharts";
import Select from "react-select";
import {useLocalStorage} from "../../hooks/useLocalSorage";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react";
import ErrorComponent from "../../components/error/ErrorComponent";
import LoadingSpinnerComponent from "../../components/loading-spinner/LoadingSpinnerComponent";
import {getRoundValue} from "../../utils";

const Home = observer(({store}) => {
    const navigate = useNavigate();

    const [selectedProductKey, setSelectedProductKey] = useLocalStorage(['filter'], store.productKeysOptions[0]);

    if (!store.productKeysOptions.find((productKeysOption) => productKeysOption.value === selectedProductKey.value && productKeysOption.visible)) {
        setSelectedProductKey(store.productKeysOptions[0]);
    }

    const months = [...Array(12).keys()].map(v => v);

    const onClick = (event, factoryId) => {
        const month = event.payload;
        store.setDetails(event);
        navigate(`details/${factoryId}/${month}`);
    }

    const getXLabel = (month) => {
        return store.humanMonths[month];
    }

    const getVal = (factoryId) => (month) => {
        const value = store.products.reduce((accumulator, currentValue) => {
            const currentValueMonth = (currentValue.date || '').split('/')[1];
            const currentValueFactory = currentValue.factory_id;
            let sum = 0;
            if (currentValueMonth !== undefined && (Number(currentValueMonth) - 1) === month && currentValueFactory === factoryId) {
                [...[selectedProductKey.value || store.productKeysOptions.filter((productKeysOption) => !!productKeysOption.value).map((productKeysOption) => productKeysOption.value)]].flatMap((value => value)).forEach((productKey) => {
                    if (currentValue[productKey] !== undefined && currentValue[productKey] !== null) {
                        sum = sum + currentValue[productKey];
                    }
                });
            }
            return accumulator + sum;
        }, 0);
        return getRoundValue(value / 1000, 2);
    }

    return (
        !!selectedProductKey && <div className="wrapper">
            <div className="select-wrapper">
                <div className="select-label">
                    Фильтр по типу продукции
                </div>
                <Select
                    className="select"
                    options={store.productKeysOptions.filter((productKeysOption) => productKeysOption.visible)}
                    defaultValue={selectedProductKey}
                    onChange={setSelectedProductKey}
                />
            </div>
            <div className="products-chart-wrapper">
                {store.loadingProducts && <LoadingSpinnerComponent />}
                {!store.loadingProducts && store.loadingProductsError && <ErrorComponent store={store} />}
                {!store.loadingProducts && !!store?.products &&
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={months}
                            margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                            barCategoryGap={'15%'}
                        >
                            <XAxis dataKey={getXLabel} />
                            <YAxis />
                            <Legend
                                payload={[
                                    {value: 'Фабрика ' + store.factoryNames[1], type: 'square', color: '#FE0000'},
                                    {value: 'Фабрика ' + store.factoryNames[2], type: 'square', color: '#0001F9'}
                                ]}
                            />
                            <Bar className="bar" dataKey={getVal(1)} fill="#FF0000" onClick={(event) => onClick(event, 1)} />
                            <Bar className="bar" dataKey={getVal(2)} fill="#0000FF" onClick={(event) => onClick(event, 2)} />
                        </BarChart>
                    </ResponsiveContainer>
                }
            </div>
        </div>
    );
});

export default Home;
