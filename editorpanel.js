var projectTypes;
        
var checkProjectState = function(){
    var projectState = window.devtoolsWindow.projectState;
        
    if (projectState.type == 'fileUrl'){
        $('#project-type').attr('disabled', 'true');
        $('#native-browse').attr('disabled', 'true');
        
        $('#file-select').hide();
        $('#auto-refresh').hide();
        $('#auto-save').hide();
    }
    else if (projectState.type){
        var typeSelect = document.getElementById('project-type');
        $('#project-type').removeAttr('disabled');
        $('#native-browse').removeAttr('disabled');
        
        for (var i = 0; i < projectTypes.length; i++){
            if (projectTypes[i].key === projectState.type){
                typeSelect.value = String(i);
                break;
            }
        }
        $('#local-file-path').text(projectState.path).show();
        $('#toggle-watch')[0].checked = projectState.watchFiles;
        $('#toggle-autosave')[0].checked = projectState.autosave;
        
        $('#file-select').show();
        $('#auto-refresh').show();
        $('#auto-save').show();
        
        $('#load-error').hide();
        $('#error-img').hide();
        $('#success-img').show();
        $('#load-success').show();
    }
    
    var loggingEnabled = devtoolsWindow.localStorage['logging'] === 'true';
    toggleLogging(loggingEnabled);
    $('#toggle-logging')[0].checked = loggingEnabled;
    
}

var initUI = function(){

    var typeSelect = document.getElementById('project-type');
    
    backgroundMsgSupport.getProjectTypes(function(types){
        projectTypes = types;
        for (var i = 0; i < projectTypes.length; ++i) {
            var projectType = projectTypes[i];
            typeSelect.add(new Option(projectType.name, i));
        }
        checkProjectState();
    });
    $(typeSelect).on('change', function(e){
        var index = Number(typeSelect.value);
        var projectType = projectTypes[index];
        if (projectType.locationType == 'local'){
            $('#file-select').show();
        }
    });
    $('#native-browse').on('click', function(e){
        var index = Number(typeSelect.value);
        backgroundMsgSupport.launchFileSelect(index, window.devtoolsWindow.inspectedLocation.origin, function(result){
            if (result.path && result.path.length){
                $('#local-file-path').text(result.path).show();
                if (result.error){
                    logError(result.error);
                    $('#load-error').text(result.error).show();
                    $('#error-img').show();
                    $('#success-img').hide();
                    $('#load-success').hide();
                }
                else{
                    var projectType = projectTypes[index];
                    window.devtoolsWindow.loadProject(projectType.key, result.path, true, true);
                    $('#toggle-autosave')[0].checked = true;
                    $('#toggle-watch')[0].checked = true;
                    $('#auto-refresh').show();
                    $('#auto-save').show();
                    
                    $('#load-error').hide();
                    $('#error-img').hide();
                    $('#success-img').show();
                    $('#load-success').show();
                }
            }
        });
        return false;
    });
    $('#toggle-watch').on('change', function(e){
        var path = $('#local-file-path').text();
        if (path && path.length){
            this.disabled=true;
            var self = this;
            window.devtoolsWindow.toggleWatchingFiles(this.checked, path, function(){
                self.disabled = false;
                window.devtoolsWindow.saveProjectState();
            });
        }
    });
    $('#toggle-autosave').on('change', function(e){
        if (window.devtoolsWindow.projectState){
            window.devtoolsWindow.projectState.autosave = this.checked;
        }
        window.devtoolsWindow.saveProjectState();
    });
    $('#toggle-logging').on('change', function(e){
        devtoolsWindow.localStorage['logging'] = '' + this.checked;
        toggleLogging(this.checked);
        devtoolsWindow.toggleLogging(this.checked);
    });
    
};