/*
* A hook to change OAuth URI.
*/

var fs = require('fs');
var path = require('path');
const OAUTH_URI = "emission.auth";
const LOG_NAME = "Changing OAuth URI: ";

var changeUri = function (file, currentName, newName) {
    if (fs.existsSync(file)) {
        var data = fs.readFileSync(file, 'utf8');

        var regEx = new RegExp(currentName, 'g');
        var result = data.replace(regEx, newName + '.auth');
    
        fs.writeFileSync(file, result, 'utf8');
        console.log(LOG_NAME + " " + file + " updated...");
    } else {
        throw new Error(LOG_NAME + 'Unable to find ' + file + '.');        
    }
}

module.exports = function (context) {
    // If ios platform is not installed, don't even execute
    if (context.opts.cordova.platforms.indexOf('ios') < 0)
        return;

    console.log(LOG_NAME + "Retrieving application name...")
    var config_xml = path.join(context.opts.projectRoot, 'config.xml');
    var et = context.requireCordovaModule('elementtree');
    var data = fs.readFileSync(config_xml).toString();
    // If no data then no config.xml
    if (data) {
        var etree = et.parse(data);
        var applicationName = etree._root.attrib.id;
        console.log(LOG_NAME + "Your application is " + applicationName);

        var secretFile = path.join(context.opts.projectRoot, "resources/fabmob/make/secret-cloak.key");
        if (fs.existsSync(secretFile)) {
            var data = fs.readFileSync(secretFile, 'utf8');
            applicationName = applicationName + "." + data;
            console.log(LOG_NAME + "I have now a secret cloak, stealth mode!");
        } else {
            console.log(LOG_NAME + "No secret file, pursuing without it.")
        }

        var platformRoot = path.join(context.opts.projectRoot, 'platforms/ios/')
        console.log(LOG_NAME + "Updating FabMob-Info.plist...");
        var infoPList = path.join(platformRoot, 'Traceur de mobilité FabMob/Traceur de mobilité FabMob-Info.plist');
        changeUri(infoPList, OAUTH_URI, applicationName);

        console.log(LOG_NAME + "Updating OpenIDAuth.m");
        var tracker = path.join(platformRoot, 'Traceur de mobilité FabMob/Plugins/edu.berkeley.eecs.emission.cordova.auth/OpenIDAuth.m');
        changeUri(tracker, OAUTH_URI, applicationName);

        console.log(LOG_NAME + "Updating ios.json");
        var iosJson = path.join(platformRoot, 'ios.json');
        changeUri(iosJson, OAUTH_URI, applicationName);
    } else {
        throw new Error(LOG_NAME + "Could not retrieve application name.");
    }
}