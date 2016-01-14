cd public/js
browserify script.js -t babelify -o compiled.js 
cd ../../
node app.js
