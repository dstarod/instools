import store from './store';
import * as api from './api';
import constants, {routes} from './constants';

const catchApiError = error => {
    if (error.response) {
        if(error.response.data !== undefined){
            alert(error.response.data.error);
        }
        else{
            alert(error.message);
        }
        if(error.response.status === 401){
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
        type: constants.SUBSCRIPTIONS_REMOVE,
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
    api.logout(function () {
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
    });
};

exports.Follow = function (user_id) {
    api.Follow([user_id], setUserAsChangingRelation, setUserAsFollowed)
};

exports.Unfollow = function (user_id) {
    api.Unfollow(
        [user_id],
        (user_id) => {
            store.dispatch({
                type: constants.USER_CHANGES_IN_PROGRESS,
                payload: user_id
            });
        },
        (user_id) => {
            store.dispatch({
                type: constants.SUBSCRIPTIONS_REMOVE,
                payload: user_id
            });
        }
    );
};

exports.UnfollowAll = function () {
    const users = store.getState().userList.users.filter(function (user) {
        return user.followed === constants.USER_FOLLOWER;
    });
    users.map(function (user) {
        setUserWaiting(user.id);
    });
    api.Unfollow(users.map(function (user) {
        return user.id;
    }), setUserAsChangingRelation, setUserAsUnFollowed);
};
