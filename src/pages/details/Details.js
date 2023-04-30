import './Details.css';
import {useParams} from "react-router-dom";
import {Legend, Pie, PieChart, ResponsiveContainer} from "recharts";
import {observer} from "mobx-react";
import {getRoundValue} from "../../utils";

const Details = observer(({store}) => {
    let { factory, month } = useParams();

    const humanMonth = store.humanMonths[month];

    const getDetails = (factoryId, month) => {
        const initialDetails = {};
        store.productKeysOptions.filter((productKeysOption) => !!productKeysOption.value && productKeysOption.visible).forEach((productKeysOption) => {
            initialDetails[productKeysOption.value] = {
                name: store.productNames[productKeysOption.value],
                value: 0,
                fill: store.productColors[productKeysOption.value],
            };
        });
        const details = store.products.reduce((accumulator, currentValue) => {
            const currentValueMonth = (currentValue.date || '').split('/')[1];
            const currentValueFactory = currentValue.factory_id;
            if (currentValueMonth !== undefined && (Number(currentValueMonth) - 1) === month && currentValueFactory === factoryId) {
                store.productKeysOptions.filter((productKeysOption) => !!productKeysOption.value && productKeysOption.visible).map((productKeysOption) => productKeysOption.value).forEach((productKey) => {
                    if (currentValue[productKey] !== undefined && currentValue[productKey] !== null) {
                        accumulator[productKey].value = (accumulator[productKey]?.value || 0) + currentValue[productKey];
                    }
                });
            }
            return accumulator;
        }, initialDetails);
        return Object.values(details).map((detail) => {
            return {
                name: detail.name,
                fill: detail.fill,
                value: getRoundValue(detail.value / 1000, 2),
            };
        });
    }

    return (
        !!store.products && <div className="details-wrapper">
            <div className="header-wrapper">
                <div className="header">
                    Статистика по продукции фабрики {store.factoryNames[factory]} за {humanMonth}
                </div>
            </div>
            <div className="details-chart-wrapper">
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <PieChart
                        margin={{
                            top: 32
                        }}
                    >
                        <Legend
                            // payload={[
                            //     {value: store.productNames.product1, type: 'square', color: store.productColors.product1},
                            //     {value: store.productNames.product2, type: 'square', color: store.productColors.product2}
                            // ]}
                            payload={store.productKeysOptions
                                .filter((productKeysOption) => !!productKeysOption.value && productKeysOption.visible)
                                .map((productKeysOption) => {
                                    return {
                                        value: store.productNames[productKeysOption.value], type: 'square', color: store.productColors[productKeysOption.value]
                                    };
                                })}
                            wrapperStyle={{
                                paddingTop: "32px"
                            }}
                        />
                        <Pie
                            data={getDetails(Number(factory), Number(month))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={'100%'}
                            innerRadius={'0%'}
                            fill="#8884d8"
                            label
                            labelLine={false}
                            isAnimationActive={false}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default Details;
