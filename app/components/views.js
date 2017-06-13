import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import constants, {routes} from '../constants';

const EmptyList = props => (
    <h3>Empty list</h3>
);
exports.EmptyList = EmptyList;

const SmallLoader = props => (
    <div className="button-loader"/>
);
const BigLoader = props => (
    <div className="content-loader center-block"/>
);
exports.BigLoader = BigLoader;

const UserRowTag = props => (
    <div className="row user-row">
        {props.children}
    </div>
);
exports.UserRowTag = UserRowTag;

const UserInfoTag = props => (
    <div className={"col-lg-10 col-md-8 col-sm-7 col-xs-7 " + props.className}>
        {props.children}
    </div>
);
exports.UserInfoTag = UserInfoTag;

const UserControlTag = props => (
    <div className={"col-lg-2 col-md-4 col-sm-5 col-xs-5 " + props.className}>
        {props.children}
    </div>
);
exports.UserControlTag = UserControlTag;

const WaitingButton = props => {
    return (
        <button className={"btn btn-sm btn-disabled btn-user-relation"}>
            Waiting
        </button>
    );
};

const BanButton = props => {
    return (
        <button className={"btn btn-sm btn-danger btn-user-relation"}>
            Bun user
        </button>
    );
};
exports.BanButton = BanButton;

const UnfollowAllButton = props => {
    let click = function (e) {
        actions.UnfollowAll();
    };
    return (
        <button className={"btn btn-sm btn-danger btn-user-relation"} onClick={click}>
            Unfollow all
        </button>
    );
};
exports.UnfollowAllButton = UnfollowAllButton;

const UnfollowButton = props => {
    let click = function (e) {
        actions.Unfollow(props.user_id);
    };
    return (
        <button className={"btn btn-sm btn-warning btn-user-relation"} onClick={click}>
            Unfollow
        </button>
    );
};
UnfollowButton.propTypes = {
    user_id: PropTypes.number,
};

const FollowButton = props => {
    let click = function (e) {
        actions.Follow(props.user_id);
    };
    let template;
    if(props.private){
        template = (
            <button
                className="btn btn-sm btn-default btn-user-relation disabled">
                Private
            </button>
        )
    }
    else {
        template = (
            <button
                className={"btn btn-sm btn-success btn-user-relation"}
                onClick={click}>
                Follow
            </button>
        );
    }
    return (
        template
    );
};
FollowButton.propTypes = {
    user_id: PropTypes.number,
};

const UserTableRowInfoAvatar = props => {
    return (
        <img
            className="img-circle img-avatar media-object"
            src={props.src} alt={props.alt}/>
    )
};
UserTableRowInfoAvatar.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
};


const UserTableRowInfoName = props => {
    return (
        <div>
            <div><strong>{props.name}</strong></div>
            <div className='text-muted one-line'>{props.full_name}</div>
        </div>
    );
};
UserTableRowInfoName.propTypes = {
    name: PropTypes.string.isRequired,
    full_name: PropTypes.string,
};


const UserTableRowInfo = props => {
    return (
        <div className="media">
            <div className="media-left">
                <UserTableRowInfoAvatar src={props.avatar} alt={props.name}/>
            </div>
            <div className="media-body">
                <UserTableRowInfoName name={props.name} full_name={props.full_name}/>
            </div>
        </div>
    )
};
UserTableRowInfo.propTypes = {
    name: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    avatar: PropTypes.string.isRequired,
};
exports.UserTableRowInfo = UserTableRowInfo;


const UserTableRow = props => {
    let user_control;
    if(props.followed === constants.USER_FOLLOWER) {
        user_control = (
            <UnfollowButton user_id={props.id}/>
        );
    }
    else if(props.followed === constants.USER_NOT_FOLLOWER) {
        user_control = (
            <FollowButton user_id={props.id} private={props.private}/>
        );
    }
    else if(props.followed === constants.USER_CHANGES_IN_PROGRESS){
        user_control = <SmallLoader/>;
    }
    else if(props.followed === constants.USER_CHANGES_WAITING){
        user_control = <WaitingButton/>;
    }
    else {
        user_control = (
            <div>Undefined "followed" field</div>
        );
    }

    return (
        <UserRowTag>
            <UserInfoTag>
                <UserTableRowInfo
                    avatar={props.avatar}
                    name={props.name}
                    full_name={props.full_name}
                />
            </UserInfoTag>
            <UserControlTag>
                {user_control}
            </UserControlTag>
        </UserRowTag>
    )
};
UserTableRow.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    followed: PropTypes.string,
    is_new: PropTypes.bool,
};


const UserList = props => {
    let user_list = props.users.map(function (item, index) {
        return (
            <UserTableRow {...item}/>
        );
    });
    return (
        <div>
            {user_list}
        </div>
    );
};
UserList.propTypes = {
    users: PropTypes.array.isRequired,
};
exports.UserList = UserList;


// Menu --------------------------

const NavLayout = props => (
    <nav className="navbar navbar-default">
        <div className="container-fluid">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main_menu" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"/>
                    <span className="icon-bar"/>
                    <span className="icon-bar"/>
                </button>
                <Link to="/" className="navbar-brand">InsTools</Link>
            </div>
            <div className="collapse navbar-collapse" id="main_menu">
                <ul className="nav navbar-nav">
                    {props.children}
                </ul>
            </div>
        </div>
    </nav>
);

class MainMenu extends React.Component {
    render(){
        const path = location.pathname;
        const props = this.props;
        let non_followers_active, friends_active, fans_active = '';
        if(path === '/non-followers'){
            non_followers_active = 'active';
        }
        else if(path === '/friends'){
            friends_active = 'active';
        }
        else if(path === '/fans'){
            fans_active = 'active';
        }
        if(props.customer.username === null){
            return (
                <NavLayout>
                    <li>
                        <NavLink to={routes.LOGIN}>Login</NavLink>
                    </li>
                </NavLayout>
            )
        }
        return (
            <NavLayout>
                <li className={non_followers_active}>
                    <NavLink activeClassName="active-link" to={routes.NOT_FOLLOWERS}>Non-followers</NavLink>
                </li>
                <li className={friends_active}>
                    <NavLink activeClassName="active-link" to={routes.FRIENDS}>Friends</NavLink>
                </li>
                <li className={fans_active}>
                    <NavLink activeClassName="active-link" to={routes.FANS}>Fans</NavLink>
                </li>
                <li>
                    <NavLink to={routes.LOGIN} onClick={actions.Logout}>
                        Logout ({props.customer.username})
                    </NavLink>
                </li>
            </NavLayout>
        );
    }
}
MainMenu.propTypes = {
    customer: PropTypes.object
};
const mapStateToProps = function(store) {
    return {
        customer: store.customer,
    };
};
exports.MainMenu = connect(mapStateToProps)(MainMenu);


// Login form  --------------------------

class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
        };
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.loginPost = this.loginPost.bind(this);
    }
    setUsername(e){
        this.setState({username: e.target.value});
    }
    setPassword(e){
        this.setState({password: e.target.value});
    }
    loginPost(){
        actions.Login(this.state);
    }

    render(){
        if(this.props.customer.loading){
            return <BigLoader/>;
        }
        if(this.props.customer.username){
            return (
                <div className="alert alert-success" role="alert">
                    Logged as {this.props.customer.username}
                </div>
            )
        }

        return (
            <form action={routes.LOGIN} className="form-group">
                <div className="form-group">
                    <label htmlFor="instagram-username">Instagram username</label>
                    <input type="text" className="form-control" onChange={this.setUsername} placeholder="Username" id="instagram-username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="instagram-password">Instagram password</label>
                    <input type="text" className="form-control" onChange={this.setPassword} placeholder="Password" id="instagram-password"/>
                </div>
                <div className="text-center">
                    <span className="btn btn-success" onClick={this.loginPost}>Enter</span>
                </div>
            </form>
        );
    }
}
const propsLoginForm = function(store) {
    return {
        customer: store.customer,
    };
};
exports.LoginForm = connect(propsLoginForm)(LoginForm);
