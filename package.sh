rm -rf package/*
./node_modules/.bin/nwbuild --platforms=win32 --version=0.14.7 --name="tafelspel" --buildDir package dist
mv package/tafelspel/win32 package/tafelspel/tafelspel
cd package/tafelspel/tafelspel
zip -r tafelspel.zip .
cd -
mv package/tafelspel/tafelspel/tafelspel.zip package/tafelspel.zip
rm -rf package/tafelspel