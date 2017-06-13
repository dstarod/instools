import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    UserRowTag,
    UserInfoTag,
    UserTableRowInfo,
    UnfollowAllButton,
    UserList,
    BigLoader,
    UserControlTag,
    EmptyList,
} from './views';
import constants from '../constants';
import * as actions from '../actions'


const NotFollowerListView = props => (
    <div>
        <UserRowTag>
            <UserInfoTag>
                <UserTableRowInfo
                    avatar="/static/img/noavatar.png"
                    name={props.users.length + ' user(s)'}
                    full_name=''/>
            </UserInfoTag>
            <UserControlTag className={props.users.length > 0 ? '' : 'hidden'}>
                <UnfollowAllButton/>
            </UserControlTag>
        </UserRowTag>
        <UserList users={props.users} />
    </div>
);
NotFollowerListView.propTypes = {
    users: PropTypes.array.isRequired,
};

class NotFollowerList extends React.Component{
    componentWillMount(){
        if(this.props.loaded === false){
            actions.loadRelations();
            return <EmptyList/>;
        }
    }
    render(){
        const props = this.props;
        if(props.loading === true) return <BigLoader/>;
        return <NotFollowerListView users={props.users} />
    }
}

const mapStateToProps = function(store) {
    const subscribers_pk = store.subscriberList.users.map(
        (user) => user.id
    );
    return {
        loading: store.subscriberList.loading || store.subscriptionList.loading,
        loaded: store.subscriberList.loaded && store.subscriptionList.loaded,
        users: store.subscriptionList.users
            .filter(
                (user) => !subscribers_pk.includes(user.id)
            )
            .map(
                (user) => {
                    if(user.followed === undefined){
                        user.followed=constants.USER_FOLLOWER;
                    }
                    return user;
                }
            )
    };
};

export default connect(mapStateToProps)(NotFollowerList);