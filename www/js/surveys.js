'use strict';

angular.module('emission.main.surveys', ['nvd3', 'emission.services', 'emission.survey.launch', 'emission.plugin.kvstore', 'emission.plugin.logger'])

.controller('SurveysCtrl', function ($scope, $ionicActionSheet, $ionicLoading,
                                    CommHelper, $rootScope,
                                    $ionicPlatform,
                                    $translate, SurveyLaunch) {
    
    $scope.surveys = {}
    $scope.completedSurveys = [];
    $scope.unansweredSurveys = [];

    var getSurveys = function () {
        $ionicLoading.show({
            template: $translate.instant('loading')
        });
        $scope.surveys = {}
        CommHelper.getSurveys().then(function (result) {
            $ionicLoading.hide();
            var surveys = result.surveys;
            $scope.completedSurveys = [];
            $scope.unansweredSurveys = [];
            Logger.log("User has " + result.survey_count + " surveys, surveys are:" + JSON.stringify(result.surveys));
            surveys.forEach(survey => {
                // Expired surveys do not need to be shown
                var expired = false;
                if (survey.expires != null && new Date() > new Date(survey.expires)) {
                    expired = true
                }
                // We don't want to show a non-active survey because it may be survey hidden by the admin.
                if (survey.completed == "N" && survey.active == "Y" && !expired) {
                    // If null then it never expires else we have a date to parse
                    if (survey.expires != null){ 
                        survey.expires = moment(survey.expires).format('LL');
                    } else {
                        survey.expires = $translate.instant('main-surveys.never');
                    }
                    survey.received = moment(survey.received).format('LL');
                    $scope.unansweredSurveys.push(survey);
                } else if (survey.completed != "N" && survey.active == "Y" && !expired) {
                    survey.completed = moment(survey.completed).format('LL');
                    survey.received = moment(survey.received).format('LL');
                    $scope.completedSurveys.push(survey);
                }
            });
            $scope.surveys = surveys.surveys;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.refreshSurveys = function () {
        getSurveys();
    }

    $scope.launchSurvey = function (url) {
        console.log(url)
        SurveyLaunch.startSurvey(url, "");
        $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event) {
            console.log("exiting, event = "+JSON.stringify(event));
            getSurveys();
        });
    }

    $ionicPlatform.ready(function () {
        getSurveys();
    });
});