/*
* Copyright 2012 Ryan Ackley (ryanackley@gmail.com)
*
* This file is part of Tincr.
*
* Tincr is free software: you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 2
* of the License, or (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
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