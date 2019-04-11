exports.WEEKDAY_OFFSET = { 
    'söndag': 0, 
    'sön': 0, 
    'månday': 1, 
    'mån': 1,
    'tisday': 2, 
    'tis':2, 
    'onsdag': 3, 
    'ons': 3, 
    'torsdag': 4, 
    'tors': 4, 
    'tor': 4,
    'fredag': 5, 
    'fre': 5,
    'lördag': 6, 
    'lör': 6
};
    
exports.MONTH_OFFSET = { 
    'januari': 1,
    'jan': 1,
    'jan.': 1,
    'februari': 2,
    'feb': 2,
    'feb.': 2,
    'mars': 3,
    'mar': 3,
    'mar.': 3,
    'april': 4,
    'apr': 4,
    'apr.': 4,
    'maj': 5,
    'juni': 6,
    'jun': 6,
    'jun.': 6,
    'juli': 7,
    'jul': 7,
    'jul.': 7,
    'augusti': 8,
    'aug': 8,
    'aug.': 8,
    'september': 9,
    'sep': 9,
    'sep.': 9,
    'sept': 9,
    'sept.': 9,
    'oktober': 10,
    'okt': 10,
    'okt.': 10,
    'november': 11,
    'nov': 11,
    'nov.': 11,
    'december': 12,
    'dec': 12,
    'dec.': 12
};

exports.MONTH_PATTERN = '(?:' 
    + Object.keys(exports.MONTH_OFFSET).join('|').replace(/\./g, '\\.')
    + ')';

exports.INTEGER_WORDS = {
    'ett' : 1,
    'två' : 2,
    'tre' : 3,
    'fyra' : 4,
    'fem' : 5,
    'sex' : 6,
    'sju' : 7,
    'åtta' : 8,
    'nio' : 9,
    'tio' : 10,
    'elva' : 11,
    'tolv' : 12
};
exports.INTEGER_WORDS_PATTERN = '(?:' 
    + Object.keys(exports.INTEGER_WORDS).join('|') 
    +')';

exports.ORDINAL_WORDS = {
    'första' : 1,
    'andra': 2,
    'tredje': 3,
    'fjärde': 4,
    'femte': 5,
    'sjätte': 6,
    'sjunde': 7,
    'åttonde': 8,
    'nionde': 9,
    'tionde': 10,
    'elfte': 11,
    'tolfte': 12,
    'trettonde': 13,
    'fjortonde': 14,
    'femtonde': 15,
    'sextonde': 16,
    'sjuttonde': 17,
    'artonde': 18,
    'nittonde': 19,
    'tjugonde': 20,
    'tjugoförsta': 21,
    'tjugoandra': 22,
    'tjugotredje': 23,
    'tjugofjärde': 24,
    'tjugofemte': 25,
    'tjugosjätte': 26,
    'tjugosjunde': 27,
    'tjugoåttonde': 28,
    'tjugonionde': 29,
    'trettionde': 30,
    'trettioförsta': 31
};
exports.ORDINAL_WORDS_PATTERN = '(?:' 
    + Object.keys(exports.ORDINAL_WORDS).join('|').replace(/ /g, '[ -]') 
    + ')';

var TIME_UNIT = 
    '(' + exports.INTEGER_WORDS_PATTERN + '|[0-9]+|[0-9]+\.[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*' +
    '(sek(?:under?)?|min(?:ut)?s?|timmar?|veckor?|dagar?|månader?|år?)\\s*';

var TIME_UNIT_STRICT = 
    '(?:[0-9]+|an?)\\s*' +
    '(?:sekunder?|minuter?|timmar?|dagar?)\\s*';

var PATTERN_TIME_UNIT = new RegExp(TIME_UNIT, 'i');

exports.TIME_UNIT_PATTERN = '(?:' + TIME_UNIT + ')+';
exports.TIME_UNIT_STRICT_PATTERN = '(?:' + TIME_UNIT_STRICT + ')+';

exports.extractDateTimeUnitFragments = function (timeunitText) {
    var fragments = {};
    var remainingText = timeunitText;
    var match = PATTERN_TIME_UNIT.exec(remainingText);
    while (match) {
        collectDateTimeFragment(match, fragments);
        remainingText = remainingText.substring(match[0].length);
        match = PATTERN_TIME_UNIT.exec(remainingText);
    }
    return fragments;
};

function collectDateTimeFragment(match, fragments) {
    var num = match[1].toLowerCase() ;
    if (exports.INTEGER_WORDS[num] !== undefined) {
        num = exports.INTEGER_WORDS[num];
    } else if(num === 'a' || num === 'an'){
        num = 1;
    } else if (num.match(/few/)) {
        num = 3;
    } else if (num.match(/half/)) {
        num = 0.5;
    } else {
        num = parseFloat(num);
    }

    if (match[2].match(/hour/i)) {
        fragments['hour'] = num;
    } else if (match[2].match(/min/i)) {
        fragments['minute'] = num;
    } else if (match[2].match(/sec/i)) {
        fragments['second'] = num;
    } else if (match[2].match(/week/i)) {
        fragments['week'] = num;
    } else if (match[2].match(/day/i)) {
        fragments['d'] = num;
    } else if (match[2].match(/month/i)) {
        fragments['month'] = num;
    } else if (match[2].match(/year/i)) {
        fragments['year'] = num;
    }

    return fragments;
}