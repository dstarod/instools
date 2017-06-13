import {createStore, combineReducers} from 'redux';
import {customerReducer} from './reducers/customer';
import {subscriberListReducer} from './reducers/subscribers';
import {subscriptionListReducer} from './reducers/subscriptions';


const reducers = combineReducers({
    customer: customerReducer,
    subscriberList: subscriberListReducer,
    subscriptionList: subscriptionListReducer,
});
const store = createStore(reducers);

export default store;
