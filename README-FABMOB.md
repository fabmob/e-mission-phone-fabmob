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
