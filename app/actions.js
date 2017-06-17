import store from './store';
import * as api from './api';
import constants, {routes} from './constants';


const logout = () => {
    store.dispatch({
        type: constants.LOGOUT,
        payload: true
    });
    store.dispatch({
        type: constants.SUBSCRIBERS_DROP_CACHE,
        payload: true
    });
    store.dispatch({
        type: constants.SUBSCRIPTIONS_DROP_CACHE,
        payload: true
    });
};

const catchApiError = error => {
    if (error.response) {
        if(error.response.data !== undefined){
            alert(error.response.data.error);
        }
        else{
            alert(error.message);
        }
        if(error.response.status === 401){
            logout();
            location.href = routes.LOGIN;
        }
    } else if (error.request) {
        alert(error.request);
    } else {
        alert(error.message);
    }
};

const setUserAsUnFollowed = function (user_id) {
    store.dispatch({
        type: constants.SUBSCRIPTION_REMOVE,
        payload: user_id
    });
};
const setUserAsChangingRelation = function (user_id) {
    store.dispatch({
        type: constants.USER_CHANGES_IN_PROGRESS,
        payload: user_id
    })
};
const setUserWaiting = function (user_id) {
    store.dispatch({
        type: constants.USER_CHANGES_WAITING,
        payload: user_id
    })
};


exports.loadRelations = function () {
    api.loadSubscribers(
        function () {
            store.dispatch({
                type: constants.SUBSCRIBERS_LOADING_IN_PROGRESS,
                payload: true,
            });
        },
        function (users) {
            store.dispatch({
                type: constants.SUBSCRIBERS_LOADING_COMPLETE,
                payload: users
            });
            api.loadSubscriptions(
                function () {
                    store.dispatch({
                        type: constants.SUBSCRIPTIONS_LOADING_IN_PROGRESS,
                        payload: true,
                    });
                },
                function (users) {
                    store.dispatch({
                        type: constants.SUBSCRIPTIONS_LOADING_COMPLETE,
                        payload: users
                    });
                },
                function (error) {
                    store.dispatch({
                        type: constants.SUBSCRIPTIONS_LOADING_BREAK,
                        payload: true
                    });
                    catchApiError(error);
                }
            )
        },
        function (error) {
            store.dispatch({
                type: constants.SUBSCRIBERS_LOADING_BREAK,
                payload: true
            });
            catchApiError(error);
        }
    );
};

exports.Login = function(form_data) {
    api.login(
        form_data,
        function () {
            store.dispatch({
                type: constants.LOGIN_PROGRESS,
                payload: true
            })
        },
        function (username, token) {
            store.dispatch({
                type: constants.SET_TOKEN,
                payload: token
            });
            store.dispatch({
                type: constants.SET_USERNAME,
                payload: username
            });
        }
    )
};

exports.Logout = function () {
    api.logout(logout);
};

exports.Follow = function (user) {
    api.Follow(
        [user.id],
        () => {
            store.dispatch({
                type: constants.USER_CHANGES_IN_PROGRESS,
                payload: user.id
            });
        },
        () => {
            store.dispatch({
                type: constants.SUBSCRIPTION_APPEND,
                payload: user
            });
            store.dispatch({
                type: constants.USER_CHANGES_FINISHED,
                payload: user.id
            });
        }
    )
};

exports.Unfollow = function (user) {
    api.Unfollow(
        [user.id],
        () => {
            store.dispatch({
                type: constants.USER_CHANGES_IN_PROGRESS,
                payload: user.id
            });
        },
        () => {
            store.dispatch({
                type: constants.SUBSCRIPTION_REMOVE,
                payload: user.id
            });
            store.dispatch({
                type: constants.USER_CHANGES_FINISHED,
                payload: user.id
            });
        }
    );
};

exports.UnfollowAll = function () {
    const subscribers_pk = store.getState().subscriberList.users.map(
        (user) => user.id
    );

    const users = store.getState().subscriptionList.users
        .filter(
            (user) => !subscribers_pk.includes(user.id)
        );

    users.map(function (user) {
        setUserWaiting(user.id);
    });
    api.Unfollow(users.map(function (user) {
        return user.id;
    }), setUserAsChangingRelation, setUserAsUnFollowed);
};
