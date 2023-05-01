import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import {observer} from "mobx-react";
import {useEffectOnce} from "./hooks/useEffectOnce";

const App = observer(({store}) => {

    useEffectOnce(() => {
        store.loadData();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home store={store}/>}/>
            <Route path="details/:factory/:month" element={<Details store={store}/>}/>
            <Route path="*" element={<Navigate replace to="/"/>}/>
        </Routes>
    );
});

export default App;
