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

function isEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

module.exports = {
    countWords: function(words) {
        var count = 0;
        for (var i = 0; i < words.length; i++) {
            if (words[i] === '\n') {
                continue;
            }
            if (/[a-zA-Z]/.test(words[i])) {
                count++;
            }
        }
        return count;
    },

    countChars: function(words) {
        var count = 0;
        for (var i = 0; i < words.length; i++) {
            if (words[i] === '\n') {
                continue;
            }
            if (/[a-zA-Z]/.test(words[i])) {
                count += words[i].length;
            }
        }
        return count;
    },

    countTime: function(results) {
        var firstTime = null;
        var lastTime = null;
        for (var i = 0; i < results.length; i++) {
            var entry = results[i];
            if (isEmpty(entry)) {
                continue;
            }

            if (firstTime === null) {
                firstTime = entry.start;
            }
            lastTime = entry.finish;
        }
        return (lastTime - firstTime) / 1000.;
    },

    countCPSByWord: function(words, results) {
        var cpsByWord = [];
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            var result = results[i];

            if (word === '\n' || isEmpty(result) || !(/[a-zA-Z]/.test(word))) {
                cpsByWord.push(null);
                continue;
            }

            var time = (result.finish - result.start) / 1000;
            cpsByWord.push(word.length / time);
        }
        return cpsByWord;
    }
};
