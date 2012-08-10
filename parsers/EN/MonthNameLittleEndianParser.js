/*
  
  
*/

(function () {
  
  if(typeof chrono == 'undefined')
    throw 'Cannot find the chrono main module';
  
  var regFullPattern = /([0-9]{1,2})(st|nd|rd|th)?(\s*(to|\-)?\s*([0-9]{1,2})(st|nd|rd|th)?)?\s*(January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec)(\s*[0-9]{2,4})(\s*BE)?(\W|$)/i;
  var regShortPattern = /([0-9]{1,2})(st|nd|rd|th)?(\s*(to|\-)?\s*([0-9]{1,2})(st|nd|rd|th)?)?\s*(January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec)(\W|$)/i;  

  function MonthNameLittleEndianParser(text, ref, opt){
    
    opt = opt || {};
    ref = ref || new Date();
    var parser = chrono.Parser(text, ref, opt);
    
    parser.pattern = function() { return regShortPattern; }
    
    parser.extract = function(text,index){ 
      
      var results = this.results();
      var lastResult = results[results.length -1];
      if( lastResult ){
        //Duplicate...
        if( index < lastResult.index + lastResult.text.length )
          return null;
      }
      
      var date = null;
      text = text.substr(index);
      originalText = text;
      
      var matchedTokens = text.match(regFullPattern);
      if(matchedTokens){
        //Full Pattern with years
        text = matchedTokens[0];
        text = matchedTokens[0].substr(0, matchedTokens[0].length - matchedTokens[10].length);
        originalText = text;
        if(matchedTokens[2]) text = text.replace(matchedTokens[2],'');
        if(matchedTokens[3]) text = text.replace(matchedTokens[3],'');
        
        var years = matchedTokens[8];
        years = parseInt(years);
        if(years < 100){ 
          if(years > 20) years = null; //01 - 20
          else years = years + 2000;
        }
        else if(matchedTokens[9]){ //BC
          text = text.replace(matchedTokens[9], '');
          years = years - 543;
        }
        
        //
        text = text.replace(matchedTokens[8], ' ' + years);
        date = moment(text,'DD MMMM YYYY');
        if(!date) return null;
			}
			else{
			  
			  matchedTokens = text.match(regShortPattern);
			  if(!matchedTokens) return null;
			  
			  //Short Pattern (without years)
			  var text = matchedTokens[0];
  			text = matchedTokens[0].substr(0, matchedTokens[0].length - matchedTokens[8].length);
  			originalText = text;
  			if(matchedTokens[2]) text = text.replace(matchedTokens[2],'');
        if(matchedTokens[3]) text = text.replace(matchedTokens[3],'');
        
  			date  = moment(text,'DD MMMM');
  			if(!date) return null;
  			
  			//Find the most appropriated year
  			date.year(moment(ref).year());
  			var nextYear = date.clone().add('y',1);
  			var lastYear = date.clone().add('y',-1);
  			if( Math.abs(nextYear.diff(moment(ref))) < Math.abs(date.diff(moment(ref))) ){	
  				date = nextYear;
  			}
  			else if( Math.abs(lastYear.diff(moment(ref))) < Math.abs(date.diff(moment(ref))) ){	
  				date = lastYear;
  			}
			}
			
			if(matchedTokens[3]){
			  var endDay = parseInt(matchedTokens[5]);
			  var startDay = parseInt(matchedTokens[1]);
			  var endDate = date.clone();
			  
			  date.date(startDay);
			  endDate.date(endDay);
			  
			  //Check leap day or impossible date
        if(date.format('D') != matchedTokens[1]) return null;
        if(endDate.format('D') != matchedTokens[5]) return null;
        
        return new chrono.ParseResult({
          referenceDate:ref,
          text:originalText,
          index:index,
          start:{
            day:date.date(),
            month:date.month(),
            year:date.year()
          },
          end:{
            day:endDate.date(),
            month:endDate.month(),
            year:endDate.year()
          }
        });
			}
			else{
			  //Check leap day or impossible date
        if(date.format('D') != matchedTokens[1]) return null;

        return new chrono.ParseResult({
          referenceDate:ref,
          text:originalText,
          index:index,
          start:{
            day:date.date(),
            month:date.month(),
            year:date.year()
          }
        });
			}
    };
    
  	return parser;
  }
  
  chrono.parsers.MonthNameLittleEndianParser = MonthNameLittleEndianParser;
})();

