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
ProjectTypes.push(
	{
		name: 'Configuration File',
		key: 'config.file',
		locationType : 'local',
		createProject : function(root, url, callback){
			var handleError = function(e){
				callback(null, e);
			};
			Gito.FileUtils.readFile(root, 'tincr.json', 'Text', function(json){
				var config;
				try{
					config = JSON.parse(json);
				}
				catch(e){
					handleError('Failed to parse tincr.json: ' + e.message);
					return;
				}
				try{
					var project = new ConfigFileBasedProject(config, root, url);
				}
				catch(e){
					handleError('Error while trying to load tincr.json: ' + e.message);
					return;
				}
				callback(project, null);
			}, function(){handleError('Unable to open ' + root.fullPath + '/tincr.json');});
			
		} 
    }
);
