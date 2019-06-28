'use strict';

angular.module('emission.main.surveys', ['nvd3', 'emission.services', 'emission.survey.launch', 'emission.plugin.kvstore', 'emission.plugin.logger'])

.controller('SurveysCtrl', function ($scope, $ionicActionSheet, $ionicLoading,
                                    CommHelper, $rootScope,
                                    $ionicPlatform,
                                    $translate, SurveyLaunch) {
    
    $scope.surveys = {}
    $scope.completedSurveys = [];
    $scope.ongoingSurveys = [];

    var getSurveys = function () {
        $ionicLoading.show({
            template: $translate.instant('loading')
        });
        $scope.surveys = {}
        CommHelper.getSurveys().then(function (result) {
            $ionicLoading.hide();
            var surveys = result.surveys;
            $scope.completedSurveys = [];
            $scope.ongoingSurveys = [];
            Logger.log("User has "+ result.survey_count + "surveys, surveys are:" + JSON.stringify(result.surveys));
            surveys.forEach(survey => {
                if (survey.completed == "N" && survey.active == "Y") {
                    survey.received = moment(survey.received).format('LL');
                    $scope.ongoingSurveys.push(survey);
                } else if (survey.completed != "N" && survey.active == "Y") {
                    survey.completed = moment(survey.completed).format('LL');
                    survey.received = moment(survey.received).format('LL');
                    $scope.completedSurveys.push(survey);
                } else {
                    console.log(survey)
                }
            });
            $scope.surveys = surveys.surveys;
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