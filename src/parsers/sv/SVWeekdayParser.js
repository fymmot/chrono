/*


*/
var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var updateParsedComponent = require('../en/ENWeekdayParser').updateParsedComponent;


var DAYS_OFFSET = { 'söndag': 0, 'sön': 0, 'måndag': 1, 'mån': 1,'tisdag': 2, 'tis':2, 'tisd':2, 'onsdag': 3, 'ons': 3,
    'torsdag': 4, 'tors':4, 'torsd': 4, 'fredag': 5, 'fre': 5,'lördag': 6, 'lör': 6};

var PATTERN = new RegExp('(\\W|^)' +
    '(?:(?:\\,|\\(|\\（)\\s*)?' +
    '(?:på\\s*?)?' +
    '(?:(den här|senaste|förra|nästa)\\s*)?' +
    '(' + Object.keys(DAYS_OFFSET).join('|') + ')' +
    '(?:\\s*(?:\\,|\\)|\\）))?' +
    '(?:\\s*(den här|senaste|förra|nästa)\\s*vecka)?' +
    '(?=\\W|$)', 'i');

var PREFIX_GROUP = 2;
var WEEKDAY_GROUP = 3;
var POSTFIX_GROUP = 4;


exports.Parser = function SVWeekdayParser() {
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; };

    this.extract = function(text, ref, match, opt){
        var index = match.index + match[1].length;
        var text = match[0].substr(match[1].length, match[0].length - match[1].length);
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref
        });

        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        var offset = DAYS_OFFSET[dayOfWeek];
        if(offset === undefined) {
            return null;
        }

                var modifier = null;
        var prefix = match[PREFIX_GROUP];
        var postfix = match[POSTFIX_GROUP];
        if (prefix || postfix) {
            var norm = prefix || postfix;
            norm = norm.toLowerCase();

            if(norm == 'den här') {
                modifier = 'this';
            }
            else if(norm == 'nästa' || norm == 'nästa') {
                modifier = 'next';
            }
            else if(norm== 'den här') {
                modifier =  'this';
            }
        }

        updateParsedComponent(result, ref, offset, modifier);
        result.tags['SVWeekdayParser'] = true;
        return result;
    }
};
