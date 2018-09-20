
rm -rf dist/*
./node_modules/.bin/babel src --out-dir tmp
mkdir dist/js
cp -R tmp/* dist
cp -R lib dist
cp src/index.html dist
cp package.json dist
rm -rf tmp
