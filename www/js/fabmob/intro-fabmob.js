'use strict';

angular.module('emission.intro', ['emission.splash.startprefs',
                                  'ionic-toast', 'emission.services']) //fabmob

.config(function($stateProvider) {
  $stateProvider
  // setup an abstract state for the intro directive
    .state('root.intro', {
    url: '/intro',
    templateUrl: 'templates/fabmob/intro/intro-fabmob.html',
    controller: 'IntroCtrl'
  })
  .state('root.reconsent', {
    url: '/reconsent',
    templateUrl: 'templates/fabmob/intro/reconsent-fabmob.html',
    controller: 'IntroCtrl'
  });
})

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate,
    $ionicPopup, $ionicHistory, ionicToast, $http, $timeout, CommHelper, StartPrefs) { //fabmob
  $scope.getIntroBox = function() {
    return $ionicSlideBoxDelegate.$getByHandle('intro-box');
  };

  $scope.stopSliding = function() {
    $scope.getIntroBox().enableSlide(false);
  };

  $scope.showSettings = function() {
    window.cordova.plugins.BEMConnectionSettings.getSettings().then(function(settings) {
      var errorMsg = JSON.stringify(settings);
      var alertPopup = $ionicPopup.alert({
        title: 'settings',
        template: errorMsg
      });

      alertPopup.then(function(res) {
        $scope.next();
      });
    }, function(error) {
        $scope.alertError('getting settings', error);
    });
  };

  $scope.disagree = function() { //fabmob
    if ($state.is('root.intro')) {
      $scope.previous();
    }
    // else {
    //   $state.go('root.main.heatmap');
    // }
  };

  $scope.agree = function() {
    StartPrefs.markConsented().then(function(response) { //fabmob
      $ionicHistory.clearHistory();
      if ($state.is('root.intro')) {
        $scope.next();
      }
      // else {
      //   StartPrefs.loadPreferredScreen();
      // }
    });
  };

  $scope.next = function() {
    $scope.getIntroBox().next();
  };

  $scope.previous = function() {
    $scope.getIntroBox().previous();
  };

  $scope.alertError = function(title, errorResult) {
      var errorMsg = JSON.stringify(errorResult);
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: errorMsg
      });

      alertPopup.then(function(res) {
        window.Logger.log(window.Logger.LEVEL_INFO, errorMsg + ' ' + res);
      });
  }

  $scope.login = function() {
    window.cordova.plugins.BEMJWTAuth.signIn().then(function(userEmail) {
      // ionicToast.show(message, position, stick, time);
      // $scope.next();
      ionicToast.show(userEmail, 'middle', false, 2500);
      CommHelper.registerUser(function(successResult) {
        $http.get("https://fabmob.grfmap.com/fabmob/user_emission/?user_email=" + userEmail).then(function(response) { // fabmob
          console.log('user_email response', response)
        }, function(error) {
          console.log('user_email error', error)
        });
        $scope.finish();
      }, function(errorResult) {
        $scope.finish();
      });
    }, function(error) {
        $scope.finish();
    });
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    /*
     * The slidebox is created as a child of the HTML page that this controller
     * is associated with, so it is not available when the controller is created.
     * There is an onLoad, but it is for ng-include, not for random divs, apparently.
     * Trying to create a new controller complains because then both the
     * directive and the controller are trying to ask for a new scope.
     * So instead, I turn off swiping after the initial summary is past.
     * Since the summary is not legally binding, it is fine to swipe past it...
     */
    if (index > 0) {
        $scope.getIntroBox().enableSlide(false);
    }
  };

  $scope.finish = function() {
    // this is not a promise, so we don't need to use .then
    StartPrefs.markIntroDone();
    $scope.getIntroBox().slide(0);
    StartPrefs.loadPreferredScreen();
  }
});

