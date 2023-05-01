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
        navigate(`details/${factoryId}/${month}`);
    }

    const getXLabel = (month) => {
        return store.humanMonths[month];
    }

    const getVal = (factoryId) => (month) => {
        const value = store.data[month][factoryId][selectedProductKey.value];
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
                {store.loadingData && <LoadingSpinnerComponent />}
                {!store.loadingData && store.loadingDataError && <ErrorComponent store={store} />}
                {!store.loadingData && !!store?.data &&
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
                                payload={Object.values(store.factories).map((factory) => {
                                    return {
                                        value: 'Фабрика ' + factory.name,
                                        type: 'square',
                                        color: factory.color,
                                    };
                                })}
                            />
                            {Object.keys(store.factories).map((factoryKey) =>
                                <Bar
                                    key={factoryKey}
                                    className="bar"
                                    dataKey={getVal(factoryKey)}
                                    fill={store.factories[factoryKey].color}
                                    onClick={(event) => onClick(event, factoryKey)}
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                }
            </div>
        </div>
    );
});

export default Home;
