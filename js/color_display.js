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

var WordStats = require('./word_stats.js');
var Spacing = require('./spacing.js');

function intToHexDigits(x) {
    var s = x.toString(16);
    if (s.length === 1) {
        return '0'+s;
    } else if (s.length > 2) {
        return 'ff';
    }
    return s;
}

function colorByCPS(medianCPS, minCPS, maxCPS, cps) {
    if (cps === medianCPS || cps === null) {
        return '#000000';
    }

    var red = 0;
    var green = 0;
    var blue = 0;
    if (cps < medianCPS) {
        var maxDistance = medianCPS - minCPS;
        var currentDistance = medianCPS - cps;
        if (maxDistance <= 0 || currentDistance <= 0) {
            return '#000000';
        }

        var proportion = currentDistance / maxDistance;
        red = Math.floor(proportion * 255);
    } else {
        var maxDistance = maxCPS - medianCPS;
        var currentDistance = cps - medianCPS;
        if (maxDistance <= 0 || currentDistance <= 0) {
            return '#000000';
        }

        var proportion = currentDistance / maxDistance;
        green = Math.floor(proportion * 255);
    }

    var redString = intToHexDigits(red);
    var greenString = intToHexDigits(green);
    var blueString = intToHexDigits(blue);

    return '#'+redString+greenString+blueString;
}

var ColorDisplay = React.createClass({
    propTypes: {
        words: React.PropTypes.array.isRequired,
        results: React.PropTypes.array.isRequired
    },

    render: function() {
        var words = this.props.words;
        var results = this.props.results;

        var cpsByWord = WordStats.countCPSByWord(words, results);
        var sortedCPS = cpsByWord.filter(function(v, i, is) {
            return v !== null;
        }).sort(function(a, b) { return b - a; });

        var length = sortedCPS.length;
        var medianCPS = sortedCPS.length % 2 === 0
            ? (sortedCPS[length / 2] + sortedCPS[(length / 2) - 1]) / 2
            : sortedCPS[Math.floor(length / 2)];

        var minCPS = null;
        var maxCPS = null;
        for (var i = 0; i < cpsByWord.length; i++) {
            var cps = cpsByWord[i];
            if (minCPS === null || cps < minCPS) {
                minCPS = cps;
            }
            if (maxCPS === null || cps > maxCPS) {
                maxCPS = cps;
            }
        }

        var key = 0;
        var paragraphKey = 0;
        var paragraphs = [];
        var currentParagraph = [];
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            var lastWord = i > 0 ? words[i - 1] : '';
            if (word !== '\n') {
                if (Spacing.spaceBefore(word, lastWord)) {
                    currentParagraph.push(<em key={key++}>{' '}</em>);
                }

                var color = colorByCPS(
                    medianCPS,
                    minCPS,
                    maxCPS,
                    cpsByWord[i]
                );
                currentParagraph.push(
                    <em key={key++} style={{color: color}}>{word}</em>
                );
            }

            if (word === '\n' || i === words.length - 1) {
                paragraphs.push(<p key={key++}>{currentParagraph}</p>);
                currentParagraph = [];
                wordKey = 0;
            }
        }

        return <div className="colorDisplay">{paragraphs}</div>;
    }
});
module.exports = ColorDisplay;
