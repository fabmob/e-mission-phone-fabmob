#!/bin/bash
clear

# Get script directory
current_script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")";pwd -P)
cd "$current_script_dir"

result="$(diff <(tail -n +5 $current_script_dir/../package.cordovabuild.json) <(tail -n +5 $current_script_dir/../package.cordovabuild-fabmob.json))"
length=${#result}
if [ $length -ne 0 ]; then
    new=${result%---*}
    for url in ${new//</}; do
        if [[ $url == '"git+https'* ]]; then
            baseurl=${url:5}
            baseurl=${baseurl%?}
            baseurl=${baseurl%?}
            baseurl=${baseurl%#*}
            xmlnumline=$(grep -n "$baseurl" "$current_script_dir/../config.cordovabuild-fabmob.xml" | cut -d':' -f 1)
            jsonnumline=$(grep -n "$baseurl" "$current_script_dir/../package.cordovabuild-fabmob.json" | cut -d':' -f 1)
            oldline=$(grep "$baseurl" "$current_script_dir/../config.cordovabuild-fabmob.xml")
            oldversion=${oldline##*#}
            oldversion=${oldversion%\"*}
            newversion=${url%?}
            newversion=${newversion%?}
            newversion=${newversion##*#}
            pluginname=${oldline%\" spec*}
            pluginname=${pluginname##*name=\"}

            echo "=> update plugin $pluginname $oldversion to $newversion"
            if [[ "$OSTYPE" == "darwin"* ]]; then # macOS
                sed -i '' $xmlnumline's/'$oldversion'/'$newversion'/g' "$current_script_dir/../config.cordovabuild-fabmob.xml"
                sed -i '' $jsonnumline's/'$oldversion'/'$newversion'/g' "$current_script_dir/../package.cordovabuild-fabmob.json"
            else
                sed -i $xmlnumline's/'$oldversion'/'$newversion'/g' "$current_script_dir/../config.cordovabuild-fabmob.xml"
                sed -i $jsonnumline's/'$oldversion'/'$newversion'/g' "$current_script_dir/../package.cordovabuild-fabmob.json"
            fi

            cordova plugin rm $pluginname
        fi
    done

    platforms=""
    if [[ "$OSTYPE" == "darwin"* ]]; then # macOS
        stopasign=0
        while read -r line; do
            if [ "$line" == "Available platforms:" ]; then
                stopasign=1
            fi
            if [ $stopasign == 0 ]; then
                platforms=$platforms$line
            fi
        done < <(cordova platforms)
    else
        while read -r line; do
            if [ "$line" == "Available platforms:" ]; then
                break
            fi
            platforms=$platforms$line
        done <<< $(cordova platforms)
    fi

    if [[ $platforms == *"android"* ]]; then
        cordova platform rm android
    fi

    if [[ $platforms == *"ios"* ]]; then
        cordova platform rm ios
    fi
fi
