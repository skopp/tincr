ProjectTypes.push(
    {
        name: 'Http Web Server',
        key: 'web.server',
        locationType : 'local',
        createProject : function(root, url, callback){  
            var routes = [{from: url, to: root.fullPath}];
            var project = new UrlToDirectoryMappedProject(routes);
            callback(project);
        } 
    }
);