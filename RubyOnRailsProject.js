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
		name: 'Ruby on Rails (3.1 or higher)',
		key: 'ror3.1',
		locationType : 'local',
		createProject : function(root, url, callback){
			config = {
					toFile : [
						{from: '/assets/(.+\\.js)',
						 to: '/app/assets/javascripts/$1'},
						{from: '/assets/(.+\\.css)',
						 to: '/app/assets/stylesheets/$1'}
					],
					fromFile : [
						{from: '(\\\\|/)app\\1assets\\1(?:javascripts|stylesheets)\\1(.+(\\.js|\\.css))(\\.[a-zA-Z]+)?$',
						 to: '/assets/$2?body=1'}
					]
			};
			
			var project = new ConfigFileBasedProject(config, root, url);
			var trailer = /\s*;\s*$/;
			project.compare = function(remote,local){
				if (remote != local){
					// sprockets puts a semicolon and whitespace trailer on the end of js files. This tries to create 
					// a comparison that ignores the trailer.
					var idx = remote.indexOf(local);
					if (idx == 0){
						return remote.substring(local.length).search(trailer) == 0;
					}
				}
				else{
					return true;
				}
				return false;
			}
			callback(project);
		} 
    }
);
