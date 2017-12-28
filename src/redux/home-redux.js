import { combineReducers } from 'redux';

// reducers
function reducer1(state, action) {
  return {};
}

function reducer2(state, action) {
  return {};
}

export default combineReducers(
  {
    reducer1,
    reducer2
  }
);

// action creators
function hello(text) {
  return {
    type: 'action1',
    data: 'hello'
  }
}

export {
  hello
};