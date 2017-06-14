import constants from '../constants';

const initialState = {
    token: window.localStorage.getItem('token'),
    username: window.localStorage.getItem('username'),
    loading: false,
};

exports.customerReducer = function (state=initialState, action) {
    switch (action.type) {
        case constants.SET_TOKEN:
            const token = action.payload;
            window.localStorage.setItem('token', token);
            return Object.assign(
                {}, state, {token: token, loading: false}
            );
        case constants.SET_USERNAME:
            const username = action.payload;
            window.localStorage.setItem('username', username);
            return Object.assign(
                {}, state, {username: username, loading: false}
            );
        case constants.LOGOUT:
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('username');
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