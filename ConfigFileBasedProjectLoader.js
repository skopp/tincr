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
