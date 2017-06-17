import store from './store';
import axios from 'axios';
import {api_routes, routes} from './constants';


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
    // console.log(error.config);
};

const apiAuthorizeToken = () => {
    return {
        params: {token: store.getState().customer.token},
        timeout: 5000,
    }
};

const Unfollow = function(user_ids, act_before, act_after){
    let user_id = user_ids.shift();
    act_before(user_id);
    axios.put(api_routes.UNFOLLOW+user_id, null, apiAuthorizeToken()).then(
        function (result) {
            act_after(user_id);
            if(user_ids.length > 0){
                Unfollow(user_ids, act_before, act_after);
            }
        }
    ).catch(catchApiError);
};
exports.Unfollow = Unfollow;

const Follow = function (user_ids, act_before, act_after) {
    let user_id = user_ids.shift();
    act_before();
    axios.put(api_routes.FOLLOW+user_id, null, apiAuthorizeToken()).then(
        function (result) {
            act_after();
            if(user_ids.length > 0){
                Follow(user_ids, act_before, act_after);
            }
        }
    ).catch(catchApiError);
};
exports.Follow = Follow;

exports.loadSubscribers = function (act_before, act_success, act_fail) {
    act_before();
    axios.get(api_routes.SUBSCRIBERS, apiAuthorizeToken()).then(
        function (response) {
            act_success(response.data);
        }
    ).catch(act_fail);
};

exports.loadSubscriptions = function (act_before, act_success, act_fail) {
    act_before();
    axios.get(api_routes.SUBSCRIPTIONS, apiAuthorizeToken()).then(
        function (response) {
            act_success(response.data);
        }
    ).catch(act_fail);
};

exports.login = function (login_form_state, act_before, act_after) {
    act_before();
    axios.post(api_routes.LOGIN, login_form_state).then(function (response) {
        if(response.data.error !== undefined){
            alert(response.data.error);
        }
        else {
            act_after(login_form_state.username, response.data.token);
        }
    }).catch(catchApiError);
};

exports.logout = function (act_after) {
    axios.put(api_routes.LOGOUT, null, apiAuthorizeToken()).then(
        function (result) {
            act_after();
        }
    ).catch(catchApiError);
};