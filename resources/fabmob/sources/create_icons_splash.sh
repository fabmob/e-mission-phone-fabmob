#!/bin/bash

# Go to script directory
current_script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")";pwd -P)
cd "$current_script_dir"

if [ ! -f "$current_script_dir/icon.png" ]; then
	script -w 1024 -h 1024 -e "$current_script_dir/../icon.png" "$current_script_dir/fabmob-logo.svg";
fi

if [ ! -f "$current_script_dir/app_store_icon_1024_1024.png" ]; then
	script -w 1024 -h 1024 -e "$current_script_dir/../app_store_icon_1024_1024.png" "$current_script_dir/fabmob-logo.svg";
fi

if [ ! -f "$current_script_dir/ios/icon/icon.png" ]; then
	script -w 57 -h 57 -e "$current_script_dir/../ios/icon/icon.png" "$current_script_dir/fabmob-logo.svg";
fi

if [ ! -f "$current_script_dir/ios/icon/icon@2x.png" ]; then
	script -w 114 -h 114 -e "$current_script_dir/../ios/icon/icon@2x.png" "$current_script_dir/fabmob-logo.svg";
fi

for x in 29,small 58,small@2x 87,small@3x 40,40 80,40@2x 120,40@3x 50,50 100,50@2x 60,60 120,60@2x 180,60@3x 72,72 144,72@2x 76,76 152,76@2x 167,83.5@2x ; do
	IFS=",";
	set $x;
	unset IFS;
	if [ ! -f "$current_script_dir/ios/icon/icon-$2.png" ]; then
		script -w $1 -h $1 -e "$current_script_dir/../ios/icon/icon-$2.png" "$current_script_dir/fabmob-logo.svg";
	fi
done
if [ ! -f "$current_script_dir/ios/icon/icon-1024.png" ]; then
	script -w 1024 -h 1024 -e "$current_script_dir/../ios/icon/icon-1024.png" "$current_script_dir/fabmob-logo-noalpha.svg";
fi

for x in 36,ldpi 48,mdpi 72,hdpi 96,xhdpi 128,xxxhdpi 180,xxhdpi; do
	IFS=",";
	set $x;
	unset IFS;
	if [ ! -f "$current_script_dir/android/icon/drawable-$2-icon.png" ]; then
		script -w $1 -h $1 -e "$current_script_dir/../android/icon/drawable-$2-icon.png" "$current_script_dir/fabmob-logo.svg";
	fi
done

for file in $current_script_dir/splash/ios/*; do
	if [ -f "$file" ]; then
		script -e "$current_script_dir/../ios/splash/$(basename $file .svg).png" "$file";
	fi
done

for file in $current_script_dir/splash/android/*; do
	if [ -f "$file" ]; then
		script -e "$current_script_dir/../android/splash/$(basename $file .svg).png" "$file";
	fi
done
