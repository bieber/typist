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

var URI = require('URIjs');
var xhr = require('xhr');

var DENOMINATIONS = {
    chapters: 'chapters',
    paragraphs: 'paragraphs',
    words: 'words'
};
var DENOMINATION_LABELS = {
    chapters: 'Chapters',
    paragraphs: 'Paragraphs',
    words: 'Words'
};

function unpackResponse(denomination, data) {
    switch (denomination) {
    case DENOMINATIONS.chapters:
        var paragraphs = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                paragraphs.push(data[i][j]);
            }
        }
        data = paragraphs;

    // FALLTHROUGH
    case DENOMINATIONS.paragraphs:
        var words = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                words.push(data[i][j]);
            }
            words.push('\n');
        }
        data = words;

    //FALLTHROUGH
    default:
        return data;
    }
}

var InitialController = React.createClass({
    propTypes: {
        uri: React.PropTypes.string.isRequired,
        onLoad: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            limits: null,
            error: false,
            busy: false,
            denomination: DENOMINATIONS.paragraphs,
            counts: {
                chapters: 1,
                paragraphs: 1,
                words: 200
            }
        };
    },

    componentDidMount: function() {
        var limitsURI = new URI(this.props.uri)
            .segment(['limits', ''])
            .toString();
        xhr({uri: limitsURI}, function (err, resp, body) {
            if (err !== null) {
                this.setState({error: true});
                return;
            }
            var limits = JSON.parse(body);
            var counts = this.state.counts;
            for (var i in counts) {
                counts[i] = Math.min(counts[i], limits[i]);
            }
            this.setState({limits: JSON.parse(body), counts: counts});
        }.bind(this));
    },

    onDenominationChange: function(event) {
        this.setState({denomination: event.target.value});
    },

    onCountChange: function(event) {
        var count = Math.min(
            parseInt(event.target.value, 10),
            this.state.limits[this.state.denomination]
        );
        if (Number.isNaN(count)) {
            count = 0;
        }

        var counts = this.state.counts;
        counts[this.state.denomination] = count;
        this.setState({counts: counts});
    },

    onSubmit: function(event) {
        var denomination = this.state.denomination;
        var uri = new URI(this.props.uri)
            .segment([
                this.state.denomination,
                this.state.counts[this.state.denomination],
                ''
            ]).toString();

        this.setState({busy: true});
        xhr({uri: uri}, function(err, resp, body) {
            if (err !== null) {
                this.setState({error: true});
                return;
            }

            this.setState({busy: false});
            this.props.onLoad(unpackResponse(denomination, JSON.parse(body)));
        }.bind(this));
        event.preventDefault();
    },

    render: function() {
        if (this.state.error) {
            return (
                <p className="initialError">Request error.</p>
            );
        }

        if (!this.state.limits) {
            return (
                <p className="initialLoading">Loading Limits...</p>
            );
        }

        var options = [];
        for (var i in DENOMINATIONS) {
            options.push(
                <option key={i} value={DENOMINATIONS[i]}>
                    {DENOMINATION_LABELS[i]}
                </option>
            );
        }

        var count = this.state.counts[this.state.denomination];
        if (count === 0) {
            count = '';
        }

        return (
            <div className="initialForm">
                <form onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        disabled={this.state.busy}
                        value={count}
                        onChange={this.onCountChange}
                    />
                    <select
                        disabled={this.state.busy}
                        value={this.state.denomination}
                        onChange={this.onDenominationChange}
                    >
                        {options}
                    </select>
                    <button
                        disabled={this.state.busy || count === ''}
                        onClick={this.onSubmit}
                    >
                        Load
                    </button>
                </form>
            </div>
        );
    }
});
module.exports = InitialController;
