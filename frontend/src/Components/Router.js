import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './Main.js';
import Upload from './Upload.js';
import Watch from './Watch.js';
import Login from './Login.js';
import Register from './Register.js';
import NotFound from './NotFound.js';

const Router = () => (
    <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/upload' component={Upload} />
        <Route path='/watch/:id' component={Watch} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route path='/*' component={NotFound} />
    </Switch>
);

export default Router;