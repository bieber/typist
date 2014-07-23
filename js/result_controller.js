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

var ResultController = React.createClass({
    propTypes: {
        words: React.PropTypes.array.isRequired,
        results: React.PropTypes.array.isRequired,
        onReset: React.PropTypes.func.isRequired
    },

    render: function() {
        var words = this.props.words;
        var results = this.props.results;
        var resultItems = [];
        var wordCount = 0;
        var firstTime = null;
        var lastTime = null;

        for (var i = 0; i < words.length; i++) {
            if (words[i] === '\n') {
                continue;
            }
            if (/[a-zA-Z]/.test(words[i])) {
                wordCount++;
            }
            var item = results[i];
            var lastTime = item.finish;
            if (firstTime === null) {
                firstTime = item.start;
            }

            var timeElapsed = (item.finish - item.start) / 1000;
            resultItems.push(
                <li key={i}>
                    {words[i]}: {timeElapsed}s
                </li>
            );
        }
        var totalTime = (lastTime - firstTime) / 1000;

        return (
            <div className="resultsDisplay">
                <button onClick={this.props.onReset}>Reset</button>
                <p>Total Time: {totalTime}s</p>
                <p>Total Words: {wordCount}</p>
                <p>WPM: {wordCount / totalTime * 60}</p>
                <ul>{resultItems}</ul>
            </div>
        );
    }
});
module.exports = ResultController;
