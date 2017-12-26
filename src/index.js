import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import './style/index.css';
import Home from './containers/home';
import Topic from './containers/topic';
import Topics from './containers/topics';
import About from './containers/about';


ReactDOM.render((
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>), document.getElementById('root'));






import registerServiceWorker from './registerServiceWorker';
registerServiceWorker();
