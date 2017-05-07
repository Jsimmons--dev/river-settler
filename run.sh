cd public/js
browserify main.js -d -t [babelify] -o dist/dist_dev_main.js 
cd ../../
node server.js
