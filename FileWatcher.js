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
var FileWatcher = function(port, project, path, fsRoot){
	this.port = port;
	var tabId = port.sender.tab.id;
	this.tabId = tabId;
	this.project = project;
	this.recentUpdateHandler = new RecentUpdateHandler(2000);
	this.fsRoot = fsRoot;
	nativeFileSupport.watchDirectory(tabId.toString(), path, this.fileChanged.bind(this));
}

FileWatcher.prototype = {
	fileChanged : function(path){
		//console.log(path); 
		if (this.isMyChange(path)){
			return;
		}
		var urls = this.project.urlsForFilePath(path)
		if (urls && urls.length){
			//var port = chrome.tabs.connect(this.tabId, {name: 'fileChange'});
			var ran = Math.round(Math.random()*10000000);
			var self = this;
			urls.asyncEach(function(url, done){
				var sendContentToDevtools = function(data){
					self.port.postMessage({url: url, content: data});
					done();
				}
				
				if (url.indexOf('file://') == 0){
					var startIdx = 7;
					if (url.indexOf('localhost') == 7){
						startIdx = 16;
					}
					Gito.FileUtils.readFile(self.fsRoot, url.substring(startIdx), 'Text', sendContentToDevtools, done);
				}
				else{
					$.ajax({type: 'GET',
							url: url + (url.indexOf('?') != -1 ? '&' : '?') + 'r=' + ran,
							dataType: 'text',
							success: sendContentToDevtools,
							error: done});
				}
			}, 
			function(){
				//port.disconnect();
			});
		}
	},
	isMyChange : function(path){
		return this.recentUpdateHandler.isRecentUpdate(path);
	},
	addChangedByMe : function(path){
		this.recentUpdateHandler.addRecentUpdate(path);
	},
	stopWatching : function(){
		nativeFileSupport.stopWatching(this.tabId.toString());
	}
}
