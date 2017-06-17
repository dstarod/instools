import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import constants, {counter_user, list_type} from '../constants';
import {
    UserRowTag,
    UserInfoTag,
    UserTableRowInfo,
    UserList,
    BigLoader,
    EmptyList,
    UserControlTag,
} from './views';
import * as actions from '../actions';


const FriendListView = props => {
    counter_user.name = `${props.users.length} user(s)`;
    return (
        <div>
            <UserRowTag>
                <UserInfoTag>
                    <UserTableRowInfo user={counter_user}/>
                </UserInfoTag>
                <UserControlTag />
            </UserRowTag>
            <UserList users={props.users} type={list_type.FRIENDS}/>
        </div>
    )
};
FriendListView.propTypes = {
    users: PropTypes.array.isRequired
};

class FriendList extends React.Component{
    componentWillMount(){
        if(this.props.loaded === false && this.props.loading !== true){
            actions.loadRelations();
            return <EmptyList/>;
        }
    }
    render(){
        if(this.props.loading === true) return <BigLoader/>;
        return <FriendListView users={this.props.users} />
    }
}

const mapStateToProps = function(store) {
    const subscribers_pk = store.subscriberList.users.map(
        (user) => user.id
    );
    return {
        loading: store.subscriberList.loading || store.subscriptionList.loading,
        loaded: store.subscriberList.loaded && store.subscriptionList.loaded,
        users: store.subscriptionList.users.filter(
            (user) => subscribers_pk.includes(user.id)
        )
    };
};

export default connect(mapStateToProps)(FriendList);