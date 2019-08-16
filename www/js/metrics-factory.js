'use strict';

angular.module('emission.main.metrics.factory', ['emission.plugin.kvstore'])

.factory('FootprintHelper', function() {
  var fh = {};
  var footprint = {
    WALKING:      0,
    BICYCLING:    0,
    CAR:        267/1609,
    BUS:        278/1609,
    TRAIN:      92/1609,
    AIR_OR_HSR: 217/1609
  }
  var mtokm = function(v) {
    return v / 1000;
  }

  fh.readableFormat = function(v) {
    return v > 999? Math.round(v / 1000) + 'k kg CO₂' : Math.round(v) + ' kg CO₂';
  }
  fh.getFootprintForMetrics = function(userMetrics) {
    var result = 0;
    for (var i in userMetrics) {
      var mode = userMetrics[i].key;
      if (mode == 'ON_FOOT') {
        mode = 'WALKING';
      }
      if (mode in footprint) {
        result += footprint[mode] * mtokm(userMetrics[i].values);
      }
      else if (mode == 'IN_VEHICLE') {
        result += ((footprint['CAR'] + footprint['BUS'] + footprint['TRAIN']) / 3) * mtokm(userMetrics[i].values);
      }
      else {
        console.warn('WARNING FootprintHelper.getFootprintFromMetrics() was requested for an unknown mode: ' + mode + " metrics JSON: " + JSON.stringify(userMetrics));
      }
    }
    return result;
  }
  fh.getLowestFootprintForDistance = function(distance) {
    // Find the mode with the lowest carbon footprint (excluding non-motorized modes).
    // Another option would be to pre-calculate and store this value only once.
    var lowestFootprint = Number.MAX_VALUE;
    for (var mode in footprint) {
      if (mode == 'WALKING' || mode == 'BICYCLING') {
        // these modes aren't considered when determining the lowest carbon footprint
      }
      else {
        lowestFootprint = Math.min(lowestFootprint, footprint[mode]);
      }
    }
    return lowestFootprint * mtokm(distance);
  }
  fh.getHighestFootprintForDistance = function(distance) {
    // Find the mode with the highest carbon footprint.
    // Another option would be to pre-calculate and store this value only once.
    var highestFootprint = 0;
    for (var mode in footprint) {
      highestFootprint = Math.max(highestFootprint, footprint[mode]);
    }
    return highestFootprint * mtokm(distance);
  }
  return fh;
})

.factory('CalorieCal', function(KVStore){

  var cc = {};
  var USER_DATA_KEY = "user-data";

  cc.set = function(info) {
    return KVStore.set(USER_DATA_KEY, info);
  };
  cc.get = function() {
    return KVStore.get(USER_DATA_KEY);
  };
  cc.delete = function() {
    return KVStore.remove(USER_DATA_KEY);
  };
  Number.prototype.between = function (min, max) {
    return this >= min && this <= max;
  };
  cc.getMet = function(mode, speed) {
    if (mode == 'ON_FOOT') {
      console.log("CalorieCal.getMet() converted 'ON_FOOT' to 'WALKING'");
      mode = 'WALKING';
    }
    if (!standardMETs[mode]) {
      console.log("CalorieCal.getMet() Illegal mode: " + mode);
      return 0; //So the calorie sum does not break with wrong return type
    }
    for (var i in standardMETs[mode]) {
      if (mpstomph(speed).between(standardMETs[mode][i].range[0], standardMETs[mode][i].range[1])) {
        return standardMETs[mode][i].mets;
      }
    }
  }
  var mpstomph = function(mps) {
    return 2.23694 * mps;
  }
  var lbtokg = function(lb) {
    return lb * 0.453592;
  }
  var fttocm = function(ft) {
    return ft * 30.48;
  }
  cc.getCorrectedMet = function(met, gender, age, height, heightUnit, weight, weightUnit) {
    var height = heightUnit == 0? fttocm(height) : height;
    var weight = weightUnit == 0? lbtokg(weight) : weight;
    if (gender == 1) { //male
      var met = met*3.5/((66.4730+5.0033*height+13.7516*weight-6.7550*age)/ 1440 / 5 / weight * 1000);
      return met;
    } else if (gender == 0) { //female
      var met = met*3.5/((655.0955+1.8496*height+9.5634*weight-4.6756*age)/ 1440 / 5 / weight * 1000);
      return met;
    }
  }
  cc.getuserCalories = function(durationInMin, met) {
    return 65 * durationInMin * met;
  }
  cc.getCalories = function(weightInKg, durationInMin, met) {
    return weightInKg * durationInMin * met;
  }
  var standardMETs = {
    "WALKING": {
      "VERY_SLOW": {
        range: [0, 2.0],
        mets: 2.0
      },
      "SLOW": {
        range: [2.0, 2.5],
        mets: 2.8
      },
      "MODERATE_0": {
        range: [2.5, 2.8],
        mets: 3.0
      },
      "MODERATE_1": {
        range: [2.8, 3.2],
        mets: 3.5
      },
      "FAST": {
        range: [3.2, 3.5],
        mets: 4.3
      },
      "VERY_FAST_0": {
        range: [3.5, 4.0],
        mets: 5.0
      },
      "VERY_FAST_!": {
        range: [4.0, 4.5],
        mets: 6.0
      },
      "VERY_VERY_FAST": {
        range: [4.5, 5],
        mets: 7.0
      },
      "SUPER_FAST": {
        range: [5, 6],
        mets: 8.3
      },
      "RUNNING": {
        range: [6, Number.MAX_VALUE],
        mets: 9.8
      }
    },
    "BICYCLING": {
      "VERY_VERY_SLOW": {
        range: [0, 5.5],
        mets: 3.5
      },
      "VERY_SLOW": {
        range: [5.5, 10],
        mets: 5.8
      },
      "SLOW": {
        range: [10, 12],
        mets: 6.8
      },
      "MODERATE": {
        range: [12, 14],
        mets: 8.0
      },
      "FAST": {
        range: [14, 16],
        mets: 10.0
      },
      "VERT_FAST": {
        range: [16, 19],
        mets: 12.0
      },
      "RACING": {
        range: [20, Number.MAX_VALUE],
        mets: 15.8
      }
    },
    "IN_VEHICLE": {
      "ALL": {
        range: [0, Number.MAX_VALUE],
        mets: 0
      }
    },
    "CAR": {
      "ALL": {
        range: [0, Number.MAX_VALUE],
        mets: 0
      }
    },
    "BUS": {
      "ALL": {
        range: [0, Number.MAX_VALUE],
        mets: 0
      }
    },
    "TRAIN": {
      "ALL": {
        range: [0, Number.MAX_VALUE],
        mets: 0
      }
    },
    "AIR_OR_HSR": {
      "ALL": {
        range: [0, Number.MAX_VALUE],
        mets: 0
      }
    }
  }
  return cc;

});
