WebEditor.ProjectTypes = [];
WebEditor.ProjectSelectScreen = function(){
    
    WebInspector.HelpScreen.call(this, WebInspector.UIString("Setup Project"));
    
    var contentDiv = document.createElement('div'); 
    
    var p = document.createElement('p');
    var fieldsetElement = document.createElement("fieldset");
    fieldsetElement.createChild("label").textContent = "Project Type";
    var projectTypes = WebEditor.ProjectTypes;
    
    var select = document.createElement("select");
    for (var i = 0; i < projectTypes.length; ++i) {
        var projectType = projectTypes[i];
        select.add(new Option(projectType.name, i));
    }
    fieldsetElement.appendChild(select);
    p.appendChild(fieldsetElement);
    contentDiv.appendChild(p);
    
    p = document.createElement('p');
    fieldsetElement = document.createElement("fieldset");
    fieldsetElement.createChild("label").textContent = "Root Directory";
    var button = document.createElement('button');
    button.addEventListener('click', this.launchFileSelect.bind(this));
    button.textContent = "Browse";
    //contentDiv.appendChild(button);
    fieldsetElement.appendChild(button);
    p.appendChild(fieldsetElement);
    contentDiv.appendChild(p);
    this.contentElement.appendChild(contentDiv);
}

WebEditor.ProjectSelectScreen.prototype = {
    launchFileSelect : function(callback){
        if (window.nativeFileSupport){
            nativeFileSupport.launchFileSelect(callback);
        }
    }
}

WebEditor.ProjectSelectScreen.prototype.__proto__ = WebInspector.HelpScreen.prototype;