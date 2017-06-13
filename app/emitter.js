import store from './store'
import * as api from './api';
let {EventEmitter} = require('fbemitter');
const emitter = new EventEmitter();


emitter.addListener('User.unfollow', function (user_id) {
    api.Unfollow(user_id);
});
emitter.addListener('User.follow', function (user_id) {
    api.Follow(user_id);
});
emitter.addListener('User.unfollow_all', function () {
    store.getState().userList.users.forEach(function (item) {
        if(item.followed) emitter.emit('User.unfollow', item.id);
    });
});

export default emitter;
