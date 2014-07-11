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

window.React = require('react');
var TypingController = require('./typing_controller.js');

var words = [
    'These',
    'are',
    'some',
    'words',
    '.',
    '\n',
    'They',
    'should',
    'be',
    'typed',
    '.'
];

function displayResults(results) {
    var resultItems = [];

    for (var i = 0; i < words.length; i++) {
        if (words[i] === '\n') {
            continue;
        }
        var item = results[i];
        var timeElapsed = (item.finish - item.start) / 1000;
        resultItems.push(
            <li>
                {words[i]}: {timeElapsed}s
            </li>
        );
    }
    var totalTime =
        (results[results.length - 1].finish - results[0].start) / 1000;

    React.unmountComponentAtNode(document.body);
    React.renderComponent(
        <div>
            <p>Total Time: {totalTime}s</p>
            <ul>{resultItems}</ul>
        </div>,
        document.body
    );
}

React.renderComponent(
    <TypingController words={words} onCompletion={displayResults} />,
    document.body
);
