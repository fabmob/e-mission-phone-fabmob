'use strict';

angular.module('emission.main.surveys', ['nvd3', 'emission.services', 'emission.survey.launch', 'emission.plugin.kvstore', 'emission.plugin.logger'])

.controller('SurveysCtrl', function ($scope, $ionicActionSheet, $ionicLoading,
                                    CommHelper, $window, $ionicPopup,
                                    ionicDatePicker, $ionicPlatform,
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
            surveys.forEach(survey => {
                if (survey.completed == "N" && survey.active == "Y") {
                    $scope.ongoingSurveys.push(survey);
                } else if (survey.completed != "N" && survey.active == "Y") {
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
    }

    $ionicPlatform.ready(function () {
        getSurveys();
    });
});