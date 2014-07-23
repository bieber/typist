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

var QUOTES = {
    '"': '"',
    "'": "'"
};

var TIGHT_PUNCTUATION = {
    '-': '-',
    '"': '"',
    "'": "'"
};

function isWord(s) {
    return /[a-zA-Z0-9]/.test(s);
}

function spaceAfter(current, next) {
    if (isWord(next)) {
        return !(current in TIGHT_PUNCTUATION);
    }
    return false;
}

function spaceBefore(current, last) {
    if (isWord(current)) {
        return !(last in TIGHT_PUNCTUATION);
    }
    return false;
}

var Spacing = {
    spaceAfter: spaceAfter,
    spaceBefore: spaceBefore
};
module.exports = Spacing;
