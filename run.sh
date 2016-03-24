cd public/js
browserify main.js -t babelify -o dist_dev_main.js 
cd ../../
node server.js
