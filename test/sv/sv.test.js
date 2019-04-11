var chrono = require('../../src/chrono');
test('Test - Random text', function() { 

    var text = "...15 maj 2011 Best Available Rate "
    var results = chrono.parse(text);
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0].start.get('day')).toBe(15)
    expect(results[0].start.get('month')).toBe(5)
    expect(results[0].start.get('year')).toBe(2011)

    var text = "imorgon"
    var results = chrono.parse(text);
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0].start.get('day')).toBe(12)
    expect(results[0].start.get('month')).toBe(4)
    expect(results[0].start.get('year')).toBe(2019)


    var text = "9:00 till 17:00, 20 Maj 2013"
    var results = chrono.parse(text);
    expect(results.length).toBe(1)
    expect(results[0].start.get('hour')).toBe(9)
    expect(results[0].end.get('hour')).toBe(17)
    expect(results[0].end.get('meridiem')).toBe(1)
    expect(results[0].end.get('day')).toBe(20)
    expect(results[0].end.get('month')).toBe(5)
    expect(results[0].end.get('year')).toBe(2013)
});






