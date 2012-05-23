AtlassianPluginProject = function(){
	this.resourceMap = {};
	this.matchedResourceMap = {};
	this.matchedFileMap = {};
	this.locationType = 'local';
};
AtlassianPluginProject.prototype = {
	load : function(root, callback){
		var resourceMap = this.resourceMap;
		Gito.FileUtils.readFile(root, 'pom.xml', 'Text', function(pomText){
			var p = new DOMParser();
			var pom = p.parseFromString(pomText, "text/xml");
			var groupId = pom.querySelector('project > groupId').textContent;
			var artifactId = pom.querySelector('project > artifactId').textContent;
			
			Gito.FileUtils.readFile(root, 'src/main/resources/atlassian-plugin.xml', 'Text', function(content){
				var doc = p.parseFromString(content, "text/xml");
				var rootNode = doc.querySelector('atlassian-plugin');
				
				// '.key.value' is a little confusing. key refers to the literal "key" attribute on the xml node. value is 
				// the string value of the attribute.
				var key = rootNode.attributes.key.value;
				key = key.replace('${project.groupId}', groupId).replace('${project.artifactId}', artifactId);
				//var pattern = 'download/resources/PLUGIN_KEY:MODULE_KEY/RESOURCE_NAME';
				
				var resources = doc.querySelectorAll('web-resource resource');
				for (var i = 0; i < resources.length; i++){
					var attributes = resources[i].attributes;
					var location = attributes.location.value;
					if (location.indexOf('.js') != location.length - 3 && location.indexOf('.css') != location.length - 4){
						continue;
					}
					var moduleKey = resources[i].parentNode.attributes.key.value;
					var file = {root: root, path: '/src/main/resources' + (location.charAt(0) != '/' ? '/' : '') + location};
					
					resourceMap['download/resources/' + key + ':' + moduleKey + '/' + attributes.name.value] = file; 
					
				}
				callback();
			}); 
		});
	},
	isProjectUrl: function (url){
		var resourceMap = this.resourceMap;
		for (var end in resourceMap){
			var idx = url.indexOf(end);
			if (idx != -1 && idx == url.length - end.length){
				var file = resourceMap[end];
				this.matchedResourceMap[url] = file;
				this.matchedFileMap[file.root.fullPath + file.path] = url;
				return true;
			}
		}
		return false;
	},
	matchContents: function(url, content, callback){
		var matchedResourceMap = this.matchedResourceMap;
		var file = matchedResourceMap[url];
		if (file){
			Gito.FileUtils.readFile(file.root, file.path, 'Text', function(localContent){
				if (content != localContent){
					callback(false, 'Content for url ' + url + ' doesn\'t match local file ' + file.root.fullPath + file.path); 
					delete matchedResourceMap[url];
				}
				else{
					callback(true, 'Content for url ' + url + ' matches local file ' + file.root.fullPath + file.path);
				}
			});
		}
	},
	commitResource : function(url, content, watcher, callback){
		var localFile = this.matchedResourceMap[url];
		if (localFile){
			watcher.addChangedByMe(localFile.root.fullPath + localFile.path);
			Gito.FileUtils.mkfile(localFile.root, localFile.path, content, callback);
		}
		else{
			callback();
		}
	},
	urlsForPath : function(path){
		var single = this.matchedFileMap[path];
		if (single){
			return [single];
		}
		return [];
	},
	resetUrls : function(){
		this.matchedResourceMap = {};
		this.matchedFileMap = {};
	}
}
ProjectTypes.push(
    {
		name: 'Atlassian Plugin',
		locationType : 'local',
		createProject : function(root, callback){
			var project = new AtlassianPluginProject();
			project.load(root, function(error){
				callback(project, error);
			});
		} 
    }
);