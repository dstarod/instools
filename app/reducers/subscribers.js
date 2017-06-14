import constants from '../constants';
import {convertRawUser} from './helpers';


exports.subscriberListReducer = function (state={users: [], loading: false, loaded: false}, action) {
    switch (action.type) {
        case constants.USER_CHANGES_IN_PROGRESS:
            let new_users = state.users.map(
                function(user){
                    if(user.id === action.payload){
                        user.followed = constants.USER_CHANGES_IN_PROGRESS;
                    }
                    return user;
                }
            );
            return Object.assign(
                {}, state, {
                    users: new_users,
                    loading: false,
                    loaded: true,
                }
            );
        case constants.SUBSCRIBER_REMOVE:
            return Object.assign(
                {}, state, {
                    users: state.users.filter(
                        function(user){
                            return user.id !== action.payload
                        }
                    ),
                    loading: false,
                    loaded: true,
                }
            );
        case constants.SUBSCRIBERS_DROP_CACHE:
            return Object.assign(
                {}, state, {
                    users: [],
                    loading: false,
                    loaded: false,
                }
            );
        case constants.SUBSCRIBERS_LOADING_IN_PROGRESS:
            return Object.assign(
                {}, state, {
                    users: [],
                    loading: true,
                    loaded: false,
                }
            );
        case constants.SUBSCRIBERS_LOADING_COMPLETE:
            let raw_users = action.payload;
            let users = raw_users.map(convertRawUser);
            return Object.assign(
                {}, state, {
                    users: users,
                    loading: false,
                    loaded: true,
                }
            );
        case constants.SUBSCRIBERS_LOADING_BREAK:
            return Object.assign(
                {}, state, {
                    users: [],
                    loading: false,
                    loaded: false,
                }
            );
    }
    return state;
};