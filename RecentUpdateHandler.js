var RecentUpdateHandler = function(timeout){
	this.timeout = timeout;
	this.recentUpdates = [];
};

RecentUpdateHandler.prototype = {
	addRecentUpdate : function(key){
		this.recentUpdates.push({key:key, time:new Date().getTime()});
	},
	
	isRecentUpdate : function(key){
		var t = new Date().getTime(),
		    replace = [],
		    retVal = false;
		for (var i = 0; i < this.recentUpdates.length; i++){
			var update = this.recentUpdates[i];
			if (key === update.key && t - update.time < this.timeout){
				retVal = true;
			}
			else if (t - update.time < this.timeout){
				replace.push(update);
			}
		}
		this.recentUpdates = replace;
		return retVal;
	}
}