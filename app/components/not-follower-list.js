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
import constants, {counter_user, list_type} from '../constants';
import * as actions from '../actions'


const NotFollowerListView = props => {
    counter_user.name = `${props.users.length} user(s)`;
    return (
        <div>
            <UserRowTag>
                <UserInfoTag>
                    <UserTableRowInfo user={counter_user}/>
                </UserInfoTag>
                <UserControlTag className={props.users.length > 0 ? '' : 'hidden'}>
                    <UnfollowAllButton/>
                </UserControlTag>
            </UserRowTag>
            <UserList users={props.users} type={list_type.NOT_FOLLOWERS}/>
        </div>
    )
};
NotFollowerListView.propTypes = {
    users: PropTypes.array.isRequired,
};

class NotFollowerList extends React.Component{
    componentWillMount(){
        if(this.props.loaded === false && this.props.loading !== true){
            actions.loadRelations();
            return <EmptyList/>;
        }
    }
    render(){
        if(this.props.loading === true) return <BigLoader/>;
        return <NotFollowerListView users={this.props.users} />
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
            (user) => !subscribers_pk.includes(user.id)
        )
    };
};

export default connect(mapStateToProps)(NotFollowerList);