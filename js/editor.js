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

 * You should have received a copy of the GNU General Public License
 * along with typist.  If not, see <http://www.gnu.org/licenses/>.
 */

var React = require('react');

var Editor = React.createClass({
    propTypes: {
        word: React.PropTypes.string.isRequired,
        onStart: React.PropTypes.func.isRequired,
        onCompletion: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            attempt: '',
            started: false
        };
    },

    componentWillReceiveProps: function(newProps) {
        this.setState(this.getInitialState());
    },

    onChange: function(event) {
        var attempt = event.currentTarget.value;
        var newState = {attempt: attempt};
        if (!this.state.started) {
            newState.started = true;
            this.props.onStart();
        }
        if (attempt === this.props.word) {
            this.props.onCompletion();
        }

        this.setState(newState);
    },

    render: function() {
        var correctText = null;
        var incorrectText = null;
        var unattemptedText = null;

        var correct = true;
        var i = 0;
        while (i < this.state.attempt.length && i < this.props.word.length) {
            if (this.state.attempt[i] !== this.props.word[i]) {
                correct = false;
                break;
            }
            i++;
        }

        correctText = (
            <em className="editorCorrect">
                {this.props.word.substr(0, i)}
            </em>
        );
        if (i < this.props.word.length) {
            if (correct) {
                unattemptedText = (
                    <em className="editorUnattempted">
                        {this.props.word.substr(i)}
                    </em>
                );
            } else {
                incorrectText = (
                    <em className="editorIncorrect">
                        {this.props.word.substr(i)}
                    </em>
                );
            }
        }

        return (
            <div className="editor">
                <input
                    className="editorInput"
                    type="text"
                    value={this.state.attempt}
                    onChange={this.onChange}
                />
                <p className="editorText">
                    {correctText}{incorrectText}{unattemptedText}
                </p>
            </div>
        );
    }
});
module.exports = Editor;
