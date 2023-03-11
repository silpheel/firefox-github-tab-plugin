timestamp=`date +"%Y%m%d%H%M%S"`
mkdir -p releases
zip -r "releases/plugin-${timestamp}" LICENSE addbuttons.js manifest.json
