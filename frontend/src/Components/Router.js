import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './Main.js';
import Upload from './Upload.js'

const Router = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/upload' component={Upload} />
        </Switch>
    </main>
);

export default Router;