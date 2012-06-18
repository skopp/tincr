if (nativeFileSupport){
	
	Entry = function(parent, name, isFile){
		this.parent = parent;
		this.name = name;
		this.isFile = isFile;
		this.isDirectory = !isFile;
		this.fullPath = this._fullPath();
	}
	
	Entry.prototype = {
		_fullPath : function(){
			var path = this.name;
			
			var parent = this.parent;
			while(parent != null){
				path = parent.name + (path.charAt(0) == '/' ? '' : '/') + path;
				parent = parent.parent;
			}
			if (navigator.platform == 'Win32' && path.charAt(0) == '/'){
				path = path.substring(1);
			}
			return path;
		},
		remove : function(success, error){
			if (nativeFileSupport.removeRecursively(this.fullPath)){
				success()
			}
			else{
				error();
			}
		}
	}
	
	DirectoryEntry = function(parent, name){
		window.Entry.call(this, parent, name, false);
	}
	DirectoryEntry.prototype = {
		_make: function(){
			nativeFileSupport.createDirectory(this.fullPath);
			return this;
		},
		removeRecursively : function(success, error){
			this.remove(success, error);
		},
		getDirectory : function(path, flags, success, error){
			var de = new DirectoryEntry(this, path);
			if (false === flags.create && !nativeFileSupport.fileExists(de.fullPath)){
				error({code:FileError.NOT_FOUND_ERR});
			}
			else{
				success(de._make());
			}
		},
		getFile : function(path, options, success, error){
			var fe = new FileEntry(this, path);
			if (false === options.create && !nativeFileSupport.fileExists(fe.fullPath)){
				error({code:FileError.NOT_FOUND_ERR});
			}
			else{
				success(fe);
			}
		},
		createReader: function(){
			return new DirectoryReader(this.fullPath, this);
		}
		
	}
	
	DirectoryEntry.prototype.__proto__ = Entry.prototype;
	
	DirectoryReader = function(fullPath, parent){
		this.fullPath = fullPath;
		this.parent = parent;
	}
	DirectoryReader.prototype = {
		readEntries : function(success, error){
			if (this.entries){
				success([]);
			}
			else{
				var names = nativeFileSupport.getDirEntries(this.fullPath);
				this.entries = new Array(names.length);
				for (var i = 0; i < this.entries.length; i++){
				    var path = this.fullPath + '/' + names[i];
				    var isDir = nativeFileSupport.isDirectory(path);
					this.entries[i] = isDir ? new DirectoryEntry(this.parent, names[i]) : new FileEntry(this.parent, names[i]);
				}
				success(this.entries);
			}	
		}
	}
	
	FileEntry = function(parent, name){
		window.Entry.call(this, parent, name, true);
	}
	FileEntry.prototype ={
		file : function(success){
		    var blob;
			var size = nativeFileSupport.getFileSize(this.fullPath);
			if (size){
				var byteArray = nativeFileSupport.contentsAtPath(this.fullPath);
				//var jsArray = new Array(byteArray.length);
				//for (var i = 0; i < byteArray.length; i++){
				//	jsArray[i] = byteArray[i];
				//}
				
				var bytes = new Int8Array(byteArray);
				
				blob = bytes.buffer;
				//blob.size = size;
			
			}
			else{
				blob = new ArrayBuffer();
				//blob.size= 0;
			}
			var bb = new BlobBuilder();
			bb.append(blob);
			var b = bb.getBlob();
			b.size = size;
			success(b);
			
		},
		createWriter: function(success){
			success(new FileWriter(this.fullPath));
		}
	}
	
	FileEntry.prototype.__proto__ = Entry.prototype;
	
	
	/*BlobBuilder = function(){
		this.stuff = [];
	}
	BlobBuilder.prototype = {
		append : function(buf){
			stuff.push(buf);
		},
		getBlob : function(){
			return stuff;
		}
	}*/
	
		
	FileWriter = function(path){
		this.path = path;
	}
	FileWriter.prototype = {
		write : function(blob){
			var reader = new FileReader();
			var thiz = this;
			reader.onloadend = function(e){
				var data = Array.prototype.slice.call(new Uint8Array(reader.result), 0);
				//assumes one append call before writing
				nativeFileSupport.saveBlobToFile(thiz.path, data);
				if (thiz.onwriteend){
					thiz.onwriteend();
				}
			}
			reader.readAsArrayBuffer(blob);
		}
	}
	
	/*FileReader = function(){
	}
	
	FileReader.prototype = {
		readAsArrayBuffer : function(entry){
			if (entry.isFile){
				var byteArray = nativeFileSystem.contentsAtPath(entry._fullPath());
			
				var bytes = new Int8Array(bytesArray);
				
				this.result = bytes.buffer;
				this.onloadend();
			}
			else{
			
			}
		}
	}*/
	window.requestFileSystem = function(type, size, successCallback, errorCallback){
		var root = new DirectoryEntry(null, "");//._make();
		root.root = root;
		successCallback(root);
	}
	window.BlobBuilder = WebKitBlobBuilder;
}else{
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
}
if (!window.BlobBuilder){
	window.BlobBuilder = WebKitBlobBuilder;
}