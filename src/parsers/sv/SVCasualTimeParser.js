/*


*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\W|^)((this)?\s*(morgon|eftermiddag|kväll|natt))/i;

var TIME_MATCH = 4;

exports.Parser = function SVCasualTimeParser(){

    Parser.apply(this, arguments);


    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var text = match[0].substr(match[1].length);
        var index = match.index + match[1].length;
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        if(!match[TIME_MATCH]) TIME_MATCH = 3;
        
        switch (match[TIME_MATCH].toLowerCase()) {

            case 'eftermiddag':
                result.start.imply('meridiem', 1);
                result.start.imply('hour', 15);
                break;

            case 'kväll':
            case 'natt':
                result.start.imply('meridiem', 1);
                result.start.imply('hour', 20);
                break;

            case 'morgon':
                result.start.imply('meridiem', 0);
                result.start.imply('hour', 6);
                break;

        }
        
        result.tags['SVCasualTimeParser'] = true;
        return result;
    };
};
