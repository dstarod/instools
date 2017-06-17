import constants from '../constants';
import {convertRawUser} from './helpers';


exports.subscriberListReducer = function (state={users: [], loading: false, loaded: false}, action) {
    switch (action.type) {
        case constants.USER_CHANGES_WAITING:
            return Object.assign(
                {}, state, {
                    users: state.users.map(
                        function(user){
                            if(user.id === action.payload){
                                user.state = constants.USER_CHANGES_WAITING
                            }
                            return user;
                        }
                    ),
                    loading: false,
                    loaded: true,
                }
            );
        case constants.USER_CHANGES_IN_PROGRESS:
            return Object.assign(
                {}, state, {
                    users: state.users.map(
                        function(user){
                            if(user.id === action.payload){
                                user.state = constants.USER_CHANGES_IN_PROGRESS;
                            }
                            return user;
                        }
                    ),
                    loading: false,
                    loaded: true,
                }
            );
        case constants.USER_CHANGES_FINISHED:
            return Object.assign(
                {}, state, {
                    users: state.users.map(
                        function(user){
                            if(user.id === action.payload){
                                user.state = constants.USER_CHANGES_FINISHED;
                            }
                            return user;
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