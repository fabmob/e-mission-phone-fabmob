#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');
const LOG_NAME = "Adding locales: ";

module.exports = function (context) {
    // If Android platform is not installed, don't even execute
    var localesFolder = path.join(context.opts.projectRoot, 'locales/');

    if (context.opts.cordova.platforms.indexOf('android') < 0 || !fs.existsSync(localesFolder))
        return;
    
    var languagesFolders = fs.readdirSync(localesFolder);
    console.log(LOG_NAME + "Languages found -> " + languagesFolders);
    languagesFolders.forEach(function (language) {
        console.log(LOG_NAME + 'I found ' + language + ", I will now move the files.")
        var platformRes = path.join(context.opts.projectRoot, 'platforms/android/res');
        var wwwi18n = path.join(context.opts.projectRoot, 'www/i18n/');
        var languageFolder = localesFolder + "/" + language;

        var values = "/values-" + language;
        var valuesFolder = path.join(languageFolder, values);
        if (fs.existsSync(valuesFolder)) {
            console.log(LOG_NAME + "Moving " + valuesFolder + " to " + platformRes);

            var platformValues = platformRes + values;
            if (!fs.existsSync(platformValues)) {
                console.log(LOG_NAME + platformValues + "does not exist, I will create it.");
                fs.mkdirSync(platformValues);
            }

            fs.copySync(valuesFolder, platformValues);
            console.log(LOG_NAME + valuesFolder + "copied...")
        } else {
            console.log(LOG_NAME + valuesFolder + " not found, I will continue.")
        }

        var languagei18n = path.join(languageFolder, "/i18n/");
        if (fs.existsSync(languagei18n)) {
            console.log(LOG_NAME + "Moving " + languagei18n + " to " + wwwi18n);
            fs.copySync(languagei18n, wwwi18n);
            console.log(LOG_NAME + languagei18n + "copied...")
        } else {
            console.log(LOG_NAME + languagei18n + " not found, I will continue.")
        }
    });
}
