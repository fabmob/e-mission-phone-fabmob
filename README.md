e-mission phone app [Traceur FabMob app]
--------------------

This is the README for e-mission-phone FabMob

The description and docs of the "Traceur de Mobilités" project for FabMob are here : https://oultim.frama.site/

The full original README for e-mission-phone is here : https://github.com/e-mission/e-mission-phone/blob/master/README.md

See also the traceur phone do here : https://fabmob.readthedocs.io/en/latest/
based on the e-mission doc repo here : https://github.com/e-mission/e-mission-docs/

For end-users:
---
Please look at the [App FAQ on the wiki](https://github.com/fabmob/e-mission-phone-fabmob/wiki).

Get the "Traceur de Mobilités" project for FabMob
---

Clone repository

```
$ git clone https://github.com/fabmob/e-mission-phone-fabmob.git
```

Add Upstream repository to syncing forked repository
```
$ cd e-mission-phone-fabmob

$ git remote -v
	origin	https://github.com/fabmob/e-mission-phone-fabmob.git (fetch)
	origin	https://github.com/fabmob/e-mission-phone-fabmob.git (push)

$ git remote add upstream https://github.com/e-mission/e-mission-phone.git

$ git remote -v
	origin	https://github.com/fabmob/e-mission-phone-fabmob.git (fetch)
	origin	https://github.com/fabmob/e-mission-phone-fabmob.git (push)
	upstream	https://github.com/e-mission/e-mission-phone.git (fetch)
	upstream	https://github.com/e-mission/e-mission-phone.git (push)

$ git fetch upstream
```

Updating the e-mission-\* plugins or adding new plugins
---

Get e-mission-phone update

```
$ git pull upstream master
```

Update and setup FabMob
```
$ ./bin/fabmob_update.sh
```

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

> **WARNING**: A hook modifies (before the build) the OAuth URI, you will need to create a file `secret-cloak.key` containing a string with maximum 10 characters without uppercases (you can use [random.org](https://www.random.org/strings/?num=10&len=10&digits=on&loweralpha=on&unique=on&format=html&rnd=new) to generate it) in the folder `resources/fabmob/make/` to avoid multiple apps to listen to the same custom URL (as mentioned here https://github.com/e-mission/e-mission-docs/issues/402#issuecomment-501429914). If there is no `secret-cloak.key` file, the hook will use just your application name.
