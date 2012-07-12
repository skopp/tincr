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

var backgroundMsgSupport = {
	launchFileSelect : function(index, callback){
		chrome.extension.sendRequest({key: 'launchFileSelect', index: index}, function(response){
			callback(response);
		});
	},
	getProjectTypes : function(callback){
		chrome.extension.sendRequest({key : 'ProjectTypes'}, function(response){
			callback(response);
		});
	},
	checkResources : function(resources, callback){
		chrome.extension.sendRequest({key : 'checkResources', resources: resources}, function(response){
			callback(response);
		});
	},
	checkResourceContent : function(url, content, callback){
		chrome.extension.sendRequest({key : 'checkResourceContent', url: url, content:content}, function(response){
			callback(response);
		});
	},
	updateResource : function(url, content, callback){
		chrome.extension.sendRequest({key : 'updateResource', url: url, content:content}, function(response){
			callback(response);
		});
	},
	pageChanged : function(callback){
		chrome.extension.sendRequest({key: 'pageChanged'}, callback);
	},
	watchDirectory : function(fullPath, callback){
		chrome.extension.sendRequest({key: 'watchDirectory', path : fullPath}, function(response){
			callback(response);
		});
	},
	loadProject : function(type, path, callback){
		chrome.extension.sendRequest({key: 'loadProject', type: type, path: path}, function(response){
			callback(response);
		});
	}
}
