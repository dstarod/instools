import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ContentLayout } from './layouts';
import { LoginForm } from './views'
import NotFollowerList from './not-follower-list';
import FriendList from './friend-list';
import FanList from './fan-list';
import {routes} from '../constants';


class Authorize extends React.Component {
    componentWillMount() {
        if (this.props.customer.username === null) {
            this.props.history.push(routes.LOGIN);
        }
    }
}

class NotFollowersPage extends Authorize{
    render(){
        return (
            <ContentLayout>
                <NotFollowerList />
            </ContentLayout>
        );
    };
}
NotFollowersPage.propTypes = {
    customer: PropTypes.object
};

class FriendsPage extends Authorize{
    render() {
        return (
            <ContentLayout>
                <FriendList />
            </ContentLayout>
        );
    }
}
FriendsPage.propTypes = {
    customer: PropTypes.object
};

class Fans extends Authorize{
    render() {
        return (
            <ContentLayout>
                <FanList />
            </ContentLayout>
        );
    }
}
Fans.propTypes = {
    customer: PropTypes.object
};

const mapStateToProps = function(store) {
    return {
        customer: store.customer,
    };
};
exports.NotFollowersPage = connect(mapStateToProps)(NotFollowersPage);
exports.FriendsPage = connect(mapStateToProps)(FriendsPage);
exports.Fans = connect(mapStateToProps)(Fans);

const Login = props => {
    return (
        <ContentLayout>
            <div className="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">
                <LoginForm/>
            </div>
        </ContentLayout>
    );
};
exports.Login = Login;
