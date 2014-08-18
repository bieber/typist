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
var ColorDisplay = require('./color_display.js');

var WordStats = require('./word_stats.js');

var ResultController = React.createClass({
    propTypes: {
        words: React.PropTypes.array.isRequired,
        results: React.PropTypes.array.isRequired,
        onReset: React.PropTypes.func.isRequired
    },

    render: function() {
        var words = this.props.words;
        var results = this.props.results;

        var wordCount = WordStats.countWords(words);
        var charCount = WordStats.countChars(words);
        var elapsedTime = WordStats.countTime(results);

        var averageWPM = wordCount / elapsedTime * 60;
        var averageCPM = charCount / elapsedTime * 60;

        return (
            <div className="resultsDisplay">
                <p className="resultsWordCount">You typed {wordCount} words.</p>
                <ul className="resultsSpeeds">
                    <li>{averageWPM.toFixed(2)} WPM</li>
                    <li>{averageCPM.toFixed(2)} CPM</li>
                </ul>
                <button onClick={this.props.onReset}>Reset</button>
                <p className="resultsHelpText">
                    This is the text you typed, highlighted by speed.  Words
                    highlighted {'in'} green you typed faster than your median
                    speed (measured per character), and words highlighted
                    {' in'} red you typed slower.  The brighter the highlight,
                    the further from the median your typing speed {'for '}
                    that word.
                </p>
                <ColorDisplay words={words} results={results} />
            </div>
        );
    }
});
module.exports = ResultController;
