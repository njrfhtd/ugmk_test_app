import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import {observer} from "mobx-react";
import {useEffectOnce} from "./hooks/useEffectOnce";
import {reaction} from "mobx";
import LoadingSpinnerComponent from "./components/loading-spinner/LoadingSpinnerComponent";

const App = observer(({store}) => {

    useEffectOnce(() => {
        store.loadConfig();

        reaction(
            () => [store.config],
            ([config]) => {
                if (!!config) {
                    store.loadData();
                }
            },
            {fireImmediately: true}
        ); // reaction
    }, []);

    return (
        <>
            {!store.config && <LoadingSpinnerComponent />}
            {!!store.config &&
                <Routes>
                    <Route path="/" element={<Home store={store}/>}/>
                    <Route path="details/:factory/:month" element={<Details store={store}/>}/>
                    <Route path="*" element={<Navigate replace to="/"/>}/>
                </Routes>
            }
        </>
    );
});

export default App;
