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
    BanButton,
} from './views';
import * as actions from '../actions'


const FanListView = props => {
    counter_user.name = `${props.users.length} user(s)`;
    return (
        <div>
            <UserRowTag>
                <UserInfoTag>
                    <UserTableRowInfo user={counter_user}/>
                </UserInfoTag>
                <UserControlTag />
            </UserRowTag>
            <UserList users={props.users} type={list_type.FANS} />
        </div>
    )
};
FanListView.propTypes = {
    users: PropTypes.array.isRequired,
};

class FanList extends React.Component{
    componentWillMount(){
        if(this.props.loaded === false && this.props.loading !== true){
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
        )
    };
};

export default connect(mapStateToProps)(FanList);