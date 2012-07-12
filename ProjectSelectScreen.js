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