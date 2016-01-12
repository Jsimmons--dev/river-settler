cd public/js
browserify script.js -o compiled.js -t babelify
cd ../../
node app.js
