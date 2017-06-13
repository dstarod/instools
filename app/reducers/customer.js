import constants from '../constants';


exports.customerReducer = function (state={token: null, username: null, loading: false}, action) {
    switch (action.type) {
        case constants.SET_TOKEN:
            return Object.assign(
                {}, state, {token: action.payload, loading: false}
            );
        case constants.SET_USERNAME:
            return Object.assign(
                {}, state, {username: action.payload, loading: false}
            );
        case constants.LOGOUT:
            return Object.assign(
                {}, state, {username: null, token: null, loading: false}
            );
        case constants.LOGIN_PROGRESS:
            return Object.assign(
                {}, state, {loading: true}
            );
    }
    return state;
};