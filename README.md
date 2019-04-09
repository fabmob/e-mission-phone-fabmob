e-mission phone app [FABMOB]
--------------------

This is the README for e-mission-phone FabMob

The full original README for e-mission-phone is here : https://github.com/e-mission/e-mission-phone/blob/master/README.md

See also the e-mission doc repo here : https://github.com/e-mission/e-mission-docs/

Updating the e-mission-\* plugins or adding new plugins
---

Setup the config

```
$ ./bin/configure_xml_and_json.js cordovabuild-fabmob
```

Install all javascript components using bower

```
$ bower update
```

Make sure to install the other node modules required for the setup scripts.

```
npm install
```

Setup cocoapods. For all versions > 1.9, we need https://cocoapods.org/ support. This is used by the push plugin for the GCM pod, and by the auth plugin to install the GTMOAuth framework. This is a good time to get a cup of your favourite beverage.

```
$ sudo gem install cocoapods
$ pod setup
```

Restore cordova platforms and plugins

```
$ cordova prepare
```

Installation is now complete. You can view the current state of the application in the emulator

    $ cordova emulate ios

    OR

    $ cordova emulate android
    
Updating the e-mission-phone and the plugins
---

ATTENTION : it is NOT sufficient to just pull and get an updated `config.xml`. You have to ensure that the plugins are updated as well - see (see (#325 comment):https://github.com/e-mission/e-mission-docs/issues/325#issuecomment-477884555)

Note that by default, updating config.xml (such as by pulling these changes) DOES NOT UPDATE cordova plugins (https://stackoverflow.com/questions/40268029/updating-cordova-plugins-according-to-config-xml)

Follow these steps:

`bin/configure_xml_and_json.js cordovabuild (if using e-mission-phone as the repo)
rm -rf platforms
rm -rf plugins
cordova platform add android (instead of cordova prepare)
cordova plugin list (compare the versions to the ones in config.xml)
cordova build android`

and similar instructions for iOS if needed.
