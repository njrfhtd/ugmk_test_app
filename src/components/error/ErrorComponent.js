import {observer} from "mobx-react";
import "./ErrorComponent.css";

const ErrorComponent = observer(({store}) => {
    return (
        !!store.loadingDataError && <div className="error-wrapper">
            <div className="error-status">
                {store.loadingDataError.status}
            </div>
            <div className="error-status-text">
                {store.loadingDataError.statusText}
            </div>
        </div>
    );
});

export default ErrorComponent;
