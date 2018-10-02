
rm -rf dist/*
./node_modules/.bin/babel src/js --out-dir tmp
mkdir dist/js
cp -R tmp/* dist/js
cp -R src/lib dist
cp src/index.html dist
cp package.json dist
rm -rf tmp
