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
FileUrlProject = function(){
	this.projectUrls = {};
};
FileUrlProject.prototype = {
	filePathForUrl : function(url){
		if (url.indexOf('file://') == 0){
			var path;
			if (url.indexOf('localhost') == 7){
				path = url.substring(16);
			}
			else{
				path = url.substring(7);
			}
			if (navigator.platform.indexOf('Win') == 0 && path.charAt(0) == '/'){
				path = path.substring(1);
			}
			this.projectUrls[path] = url;
			return path;
		}
		return null;
	},
	urlsForFilePath : function(path){
		// It's not necessary to cache the urls since it's just a matter of tacking on the 'file://' 
		// in the front but I don't want to post an update 
		// to the devtools panel unless I know it's an actual project url.
		var url = this.projectUrls[path.replace('\\', '/')];
		if (url){
			return[url];
		}
		return [];
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}

FileUrlProjectFactory = {
	createProject : function(dir, url, callback){
		callback(new FileUrlProject());
	}
}
