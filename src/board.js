import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from './lib/fetch';

class MeetingBoard extends Component {
    componentDidMount() {
        this.load();
    }
    load() {
        fetch.get('/api/board/list', {
            page: 1,
            page_size: 15
        }).then(r => {
            console.log(r)
        }).catch(e => {
            console.log(e)
        })
    }
    render () {
        return (
            <div>
                
            </div>
        )
    }
}

ReactDOM.render(<MeetingBoard />, document.getElementById('root'));
