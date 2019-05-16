#!/usr/bin/env node

module.exports = function(ctx) {
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }
    var fs = ctx.requireCordovaModule('fs');
    var path = ctx.requireCordovaModule('path');

    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
    fs.copyFileSync('google-services.json', path.join(platformRoot, 'google-services.json'));
}
