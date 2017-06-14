import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import constants from '../constants';
import {
    UserRowTag,
    UserInfoTag,
    UserTableRowInfo,
    UserList,
    BigLoader,
    EmptyList,
    UserControlTag,
    BanButton,
} from './views';
import * as actions from '../actions'


const FanListView = props => (
    <div>
        <UserRowTag>
            <UserInfoTag>
                <UserTableRowInfo
                    avatar="/static/img/noavatar.png"
                    name={props.users.length + ' user(s)'}
                    full_name=''/>
            </UserInfoTag>
            <UserControlTag />
        </UserRowTag>
        <UserList users={props.users} />
    </div>
);
FanListView.propTypes = {
    users: PropTypes.array.isRequired,
};

class FanList extends React.Component{
    componentWillMount(){
        if(this.props.loaded === false){
            actions.loadRelations();
            return <EmptyList/>;
        }
    }
    render(){
        if(this.props.loading === true) return <BigLoader/>;
        return <FanListView users={this.props.users} />
    }
}

const mapStateToProps = function(store) {
    const subscriptions_pk = store.subscriptionList.users.map(
        (user) => user.id
    );
    return {
        loading: store.subscriberList.loading || store.subscriptionList.loading,
        loaded: store.subscriberList.loaded && store.subscriptionList.loaded,
        users: store.subscriberList.users.filter(
            (user) => !subscriptions_pk.includes(user.id)
        ).map(
            (user) => {
                user.followed=constants.USER_NOT_FOLLOWER;
                return user;
            }
        ),
    };
};

export default connect(mapStateToProps)(FanList);