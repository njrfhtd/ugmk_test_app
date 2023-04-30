import {observer} from "mobx-react";
import "./ErrorComponent.css";

const ErrorComponent = observer(({store}) => {
    return (
        !!store.loadingProductsError && <div className="error-wrapper">
            <div className="error-status">
                {store.loadingProductsError.status}
            </div>
            <div className="error-status-text">
                {store.loadingProductsError.statusText}
            </div>
        </div>
    );
});

export default ErrorComponent;
