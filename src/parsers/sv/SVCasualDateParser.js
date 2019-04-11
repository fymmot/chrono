/*


*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\W|^)(nu|idag|ikväll|igår\s*kväll|(?:imorgon|igår)\s*|imorgon|igår)(?=\W|$)/i;

exports.Parser = function SVCasualDateParser(){

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

        var refMoment = moment(ref);
        var startMoment = refMoment.clone();
        var lowerText = text.toLowerCase();

        if(lowerText == 'ikväll'){
            // Normally means this coming midnight
            result.start.imply('hour', 22);
            result.start.imply('meridiem', 1);

        } else if (/^imorgon/.test(lowerText)) {

            // Check not "Tomorrow" on late night
            if(refMoment.hour() > 1) {
                startMoment.add(1, 'day');
            }

        } else if (/^igår/.test(lowerText)) {

            startMoment.add(-1, 'day');

        } else if(lowerText.match(/igår\s*kväll/)) {

            result.start.imply('hour', 0);
            if (refMoment.hour() > 6) {
                startMoment.add(-1, 'day');
            }

        } else if (lowerText.match("nu")) {

          result.start.assign('hour', refMoment.hour());
          result.start.assign('minute', refMoment.minute());
          result.start.assign('second', refMoment.second());
          result.start.assign('millisecond', refMoment.millisecond());

        }

        result.start.assign('day', startMoment.date())
        result.start.assign('month', startMoment.month() + 1)
        result.start.assign('year', startMoment.year())
        result.tags['SVCasualDateParser'] = true;
        return result;
    }
}
