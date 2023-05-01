import './Details.css';
import {useParams} from "react-router-dom";
import {Legend, Pie, PieChart, ResponsiveContainer} from "recharts";
import {observer} from "mobx-react";
import {getRoundValue} from "../../utils";

const Details = observer(({store}) => {
    let { factory, month } = useParams();

    const humanMonth = store.humanMonths[month];

    const getDetails = () => {
        const details = [];
        store.productKeysOptions.filter((productKeysOption) => productKeysOption.detailsVisible).forEach((productKeysOption) => {
            details.push({
                name: store.productNames[productKeysOption.value],
                value: getRoundValue((store.data[month][factory][productKeysOption.value] || 0) / 1000, 2),
                fill: store.productColors[productKeysOption.value],
            });
        });
        return details;
    }

    return (
        !!store.data && <div className="details-wrapper">
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
                            payload={store.productKeysOptions
                                .filter((productKeysOption) => productKeysOption.detailsVisible)
                                .map((productKeysOption) => {
                                    return {
                                        value: store.productNames[productKeysOption.value],
                                        type: 'square',
                                        color: store.productColors[productKeysOption.value]
                                    };
                                })}
                            wrapperStyle={{
                                paddingTop: "32px"
                            }}
                        />
                        <Pie
                            data={getDetails()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={'100%'}
                            innerRadius={'0%'}
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
