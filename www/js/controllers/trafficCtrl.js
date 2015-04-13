angular.module('app.controllers').controller('trafficCtrl', function ($scope,$rootScope, traffic,
                                                                      $ionicLoading, $timeout, $ionicSlideBoxDelegate) {

    $scope.init = function () {

    };

    $scope.slideHasChanged = function(index){
        if (isNaN(index) == false)
        {
            var entry = $scope.entries[index];
            var marker = $rootScope.markers[entry.cameraId];
            marker.showInfoWindow();
            $rootScope.map.animateCamera({
                target: new plugin.google.maps.LatLng(entry.latitude,entry.longitude),
                tilt: 0,
                zoom: entry.zoom,
                bearing: entry.bearing,
                duration: 1000
            });
        }

    }
})