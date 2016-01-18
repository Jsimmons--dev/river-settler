cd public/model
browserify main.js -t babelify -o compiled.js 
node compiled.js 
