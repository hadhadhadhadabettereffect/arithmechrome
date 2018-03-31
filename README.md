chrome extension. colorizes numbers in webpage text.
[https://chrome.google.com/webstore/detail/arithmechrome/dbfcfldkennjhjlhaamllmllfdjljblo]

## local setup
`npm install && npm install gulp-cli -g`
run `gulp` to bundle files from src to dist
js/css/html files are in the src dir
the extension's manifest.json and icons(untracked) are in 'dist'

### TODO
* apply options updates to active tab of all open windows or on window focus
* add dom mutation observer for progressive web apps
* add list of urls to ignore to options page