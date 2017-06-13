import React from 'react';
import { MainMenu } from './views';


exports.ContentLayout = props => (
    <div>
        <MainMenu />
        <div className="container container-fluid col-md-8 col-md-offset-2">
            {props.children}
        </div>
    </div>
);

exports.MainLayout = props => {
    return (
        <div>
            {props.children}
        </div>
    )
};
