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
var TypingController = require('./typing_controller.js');
var InitialController = require('./initial_controller.js');
var ResultController = require('./result_controller.js');

var STATES = {
    initial: 0,
    typing: 1,
    results: 2
};
var PageController = React.createClass({
    propTypes: {
        config: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            state: STATES.initial,
            words: [],
            results: []
        };
    },

    onWordsLoaded: function(words) {
        this.setState({state: STATES.typing, words: words});
    },

    onCompletion: function(results) {
        this.setState({state: STATES.results, results: results});
    },

    render: function() {
        switch (this.state.state) {
        case STATES.initial:
            return (
                <InitialController
                    uri={this.props.config.wordserv}
                    onLoad={this.onWordsLoaded}
                />
            );

        case STATES.typing:
            return (
                <TypingController
                    words={this.state.words}
                    onCompletion={this.onCompletion}
                />
            );

        case STATES.results:
            return (
                <ResultController
                    words={this.state.words}
                    results={this.state.results}
                />
            );
        }
    }

});
module.exports = PageController;
