/**
 * @jsx React.DOM
 */

/*
 * Copyright Robert Bieber, 2014
 *
 * This file is part of typist.
 *
 * typist is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * typist is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with typist.  If not, see <http://www.gnu.org/licenses/>.
 */

var React = require('react');
var Editor = require('./editor.js');

var times = [];

var TypingController = React.createClass({
    propTypes: {
        words: React.PropTypes.array.isRequired,
        onCompletion: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        times = [];
        return {
            currentWord: 0
        }
    },

    componentWillReceiveProps: function() {
        this.setState(this.getInitialState());
    },

    onStart: function() {
        var now = new Date();
        times.push({start: now.getTime()});
    },

    onCompletion: function() {
        var now = new Date();
        times[this.state.currentWord].finish = now.getTime();

        var currentWord = this.state.currentWord + 1;
        while (this.props.words[currentWord] === '\n') {
            times.push({});
            currentWord++;
        }

        this.setState({currentWord: currentWord});
        if (currentWord === this.props.words.length) {
            this.props.onCompletion(times);
        }
    },

    render: function() {
        if (this.state.currentWord >= this.props.words.length) {
            return <span />;
        }

        var word = this.props.words[this.state.currentWord];
        var completionChar = '\n';
        var remainder = [];
        if (this.state.currentWord + 1 < this.props.words.length) {
            var nextWord = this.props.words[this.state.currentWord + 1];
            var remainder = this.props.words.slice(this.state.currentWord + 1);
            if (/[a-zA-Z]/.test(nextWord)) {
                completionChar = ' ';
            } else if (nextWord !== '\n') {
                completionChar = '';
            }
        }

        return (
            <Editor
                word={word}
                remainder={remainder}
                completionChar={completionChar}
                onStart={this.onStart}
                onCompletion={this.onCompletion}
            />
        );
    }
});
module.exports = TypingController;
