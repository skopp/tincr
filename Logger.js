var logMessageReal = function(msg){
	chrome.devtools.inspectedWindow.eval('console.log(' + JSON.stringify(msg) + ')');
};
var logErrorReal = function(err){
	chrome.devtools.inspectedWindow.eval('console.error(' + JSON.stringify(err) + ')');
};
var logMessage = logMessageReal, logError = logErrorReal;

var toggleLogging = function(enable){
	if (enable){
		logMessage = logMessageReal;
		logError = logErrorReal;
	}
	else{
		logMessage = function(){};
		logError = function(){};
	}
}