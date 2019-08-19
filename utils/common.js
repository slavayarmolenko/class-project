import { URLs } from "./URLs.js";

export const common = {
    isArray:( obj ) =>  { 
        return  obj && (typeof obj  === "object") && (obj instanceof Array);
    },
    processError:(result, control, action) => {
        if (!control._isMounted) {
            return true;
        }

        var errorLabel = 'Error' + (action ? (' while ' + action) : '') + ': ';
        if (result && result.data && !result.data.success) {
            if (result.data.errMessage === 'UNLOGGED') {
                control.setState({ errorText: errorLabel + 'user needs to login', logged: false });
            } else {
                control.setState({ errorText: errorLabel + result.data.errMessage });
            }
            return true;
        }
        if (result && result.response && result.response.statusText) {
            control.setState({ errorText: errorLabel + result.response.statusText });
            return true;
        }
        return false;
    }
}
