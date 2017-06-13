import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
    NotFollowersPage, FriendsPage, Fans, Login
} from './components/pages';
import { MainLayout } from './components/layouts';
import constants, {routes} from './constants';

export default (
    <Router>
        <MainLayout>
            <Route exact={true} path="/" component={Login} />
            <Route path={routes.NOT_FOLLOWERS} component={NotFollowersPage} />
            <Route path={routes.FRIENDS} component={FriendsPage} />
            <Route path={routes.FANS} component={Fans} />
            <Route path={routes.LOGIN} component={Login} />
        </MainLayout>
    </Router>
);
