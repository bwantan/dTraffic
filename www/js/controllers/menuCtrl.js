angular.module('app.controllers').controller('menuCtrl', function ($scope,$ionicLoading, $rootScope,
                                                                   $ionicPopover,$compile, $ionicSideMenuDelegate,
                                                                   helper, traffic, $timeout) {

    $scope.home = {};
    $scope.hideLeft = true;
    $scope.hideRight = true;
    $scope.locations = {};

    $scope.$watch(function(){
        return $ionicSideMenuDelegate.getOpenRatio();},
        function(newValue,oldValue){
            if (newValue == 0){
                $scope.hideLeft = true;
                $scope.hideRight = true;
                helper.setMapClickable($rootScope, true);
            }
            else{

                if (newValue < 0) // right menu
                {
                    $scope.hideRight = false;
                }
                else // left menu
                {
                    $scope.hideLeft = false;
                }
                helper.setMapClickable($rootScope, false);
            }
    })

    $scope.init = function () {
        traffic.getTrafficGroupInfo().then(function(result){
            $scope.locations = result.data;
        });
    };

    $scope.groupSelected = function(group_id){
        $scope.hideLeft = true;
        $scope.hideRight = true;
        $ionicSideMenuDelegate.toggleRight(false);
        $ionicSideMenuDelegate.toggleLeft(false);
        $timeout(function(){
            $rootScope.$broadcast('groupSelected', { 'group_id' : group_id });
        }, 500);

    }

})