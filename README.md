Tincr
=====
This is the source code for the [Tincr Chrome Extension](http://tin.cr). The docs are hosted [here](http://tin.cr/docs.html).

Building
======
Tincr is a chrome extension. You can simply checkout the source code and load it as an unpacked extension in Chrome. This will 
require that Chrome is in Developer Mode (go to chrome://extensions and tick the box). Alternatively, you can pack the extension yourself using Chrome. 

## NPAPI Chrome File API
Tincr relies on an NPAPI plugin (NPAPI Chrome File API) for all of it's native file support. For example, reading and writing local files from a chrome extension and watching local directories for changes. The source code for this is [here](https://bitbucket.org/ryanackley/npapi-chrome-file-api/src).
