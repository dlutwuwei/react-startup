import React from 'react';
import logo from 'img/logo.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hello } from '../redux/home-redux';

const Home = () => (
  <div>
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>app.js</code> and save to reload.
    </p>
  </div>
)

const mapStateToProps = state => ({
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      hello
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
