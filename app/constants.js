exports.counter_user = {
    avatar: "/static/img/noavatar.png",
    full_name: "",
    name: undefined,
    key:'user-counter'
};

const constants = {
    USER_CHANGES_IN_PROGRESS: 'USER_CHANGES_IN_PROGRESS',
    USER_CHANGES_WAITING: 'USER_CHANGES_WAITING',
    USER_CHANGES_FINISHED: 'USER_CHANGES_FINISHED',

    LOADING_IN_PROGRESS: 'LOADING_IN_PROGRESS',

    SET_TOKEN: 'SET_TOKEN',
    SET_USERNAME: 'SET_USERNAME',
    LOGOUT: 'LOGOUT',
    LOGIN_PROGRESS: 'LOGIN_PROGRESS',

    // Reduce store keys for subscribers a.k.a followers
    SUBSCRIBERS_DROP_CACHE: 'SUBSCRIBERS_DROP_CACHE',
    SUBSCRIBERS_LOADING_IN_PROGRESS: 'SUBSCRIBERS_LOADING_IN_PROGRESS',
    SUBSCRIBERS_LOADING_COMPLETE: 'SUBSCRIBERS_LOADING_COMPLETE',
    SUBSCRIBERS_LOADING_BREAK: 'SUBSCRIBERS_LOADING_BREAK',

    // Reduce store keys for subscriptions a.k.a following
    SUBSCRIPTIONS_DROP_CACHE: 'SUBSCRIPTIONS_DROP_CACHE',
    SUBSCRIPTIONS_LOADING_IN_PROGRESS: 'SUBSCRIPTIONS_LOADING_IN_PROGRESS',
    SUBSCRIPTIONS_LOADING_COMPLETE: 'SUBSCRIPTIONS_LOADING_COMPLETE',
    SUBSCRIPTIONS_LOADING_BREAK: 'SUBSCRIPTIONS_LOADING_BREAK',
    SUBSCRIPTION_REMOVE: 'SUBSCRIPTION_REMOVE',
    SUBSCRIPTION_APPEND: 'SUBSCRIPTION_APPEND',
};

exports.routes = {
    NOT_FOLLOWERS: '/not-followers',
    FRIENDS: '/friends',
    FANS: '/fans',
    LOGIN: '/login',
};

exports.api_routes = {
    SUBSCRIBERS: '/api/subscribers',
    SUBSCRIPTIONS: '/api/subscriptions',
    FOLLOW: '/api/follow/',
    UNFOLLOW: '/api/unfollow/',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout'
};

exports.list_type = {
    NOT_FOLLOWERS: 'NOT_FOLLOWERS',
    FRIENDS: 'FRIENDS',
    FANS: 'FANS',
};

export default constants;