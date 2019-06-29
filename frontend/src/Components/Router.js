import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './Main.js';
import Upload from './Upload.js';
import Watch from './Watch.js';

const Router = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/upload' component={Upload} />
            <Route path='/watch/:id' component={Watch} />
        </Switch>
    </main>
);

export default Router;