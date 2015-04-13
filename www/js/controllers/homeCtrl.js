angular.module('app.controllers').controller('homeCtrl', function ($scope,$rootScope,traffic,
                                                                   $ionicLoading, $timeout,
                                                                   $ionicSlideBoxDelegate, helper, timer) {
    $scope.home = {};
    $scope.entries = [];
    $scope.full_map = true;
    $scope.cameraInfo = undefined;
    $scope.showMenu = false;
    $rootScope.markers = {};

    $scope.init = function () {
        $scope.full_map = true;
    };

    $scope.$on('mapCreated', function(event,message) {
        if(message.created === true) {
            $scope.showTrafficCamera();
        }
    });

    $scope.closeCamera = function(){
        $scope.full_map = true;
    };

    $scope.showTrafficCamera = function(){
        $ionicLoading.show();

        $rootScope.map.animateCamera({
            target: $rootScope.center,
            tilt: 0,
            zoom: 12,
            bearing: 0,
            duration: 1000
        });

        traffic.getCameraInfo()
            .then(
            function(data){
                $scope.addTrafficIcon(data);
                $ionicLoading.hide();
            },
            function( errorMessage ) {
                $ionicLoading.hide();
            }
        );

        $scope.cameraInfo = traffic.getLocalCameraInfo();
    };

    $scope.addTrafficIcon = function(jsonData){
        if ( $rootScope.map != undefined){
            angular.forEach($scope.markers, function(marker)
            {
                marker.removeEventListener(plugin.google.maps.event.MARKER_CLICK);
            });
            $rootScope.markers = {};
            $rootScope.map.clear();
        }

        angular.forEach(jsonData, function(entry){
            const marker = new plugin.google.maps.LatLng(entry.Latitude,entry.Longitude);
            $rootScope.map.addMarker({
                'position': marker,
                'icon': 'www/img/photo.png',
                'title': entry.Group_Id + ":" + entry.CameraID + "\n" + entry.Summary
            }, function(marker) {
                $rootScope.markers[entry.CameraID] = marker;
                marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
                    $scope.showCamera(entry.CameraID, entry.Latitude, entry.Longitude,
                        traffic.getLocalCameraInfo()[entry.CameraID].CacheImage, traffic.getLocalCameraInfo()[entry.CameraID].ImageURL,
                        traffic.getLocalCameraInfo()[entry.CameraID].CreateDate, traffic.getLocalCameraInfo()[entry.CameraID].Summary,
                        traffic.getLocalCameraInfo()[entry.CameraID].Group_Id);
                });
            });
        })
    }

    $scope.showCamera = function(cameraId, latitude, longitude, cacheImage, imageUrl, createdDate, summary, group_id)
    {
        var location = new plugin.google.maps.LatLng(latitude,longitude)
        $ionicLoading.show();

        var cameraIndex = 0;
        var selectedIndex = 0;
        $scope.full_map = false;
        $scope.requestDate = Date.parse(createdDate);

        $scope.entries = [];

        traffic.getTrafficGroupInfo().then(function(result){
            var groupInfo = result.data[group_id];

            var cameraId = groupInfo["camera"][0]["id"];

            $ionicLoading.show();
            var imageUrl = $scope.cameraInfo[cameraId].ImageURL;
            var latitude = $scope.cameraInfo[cameraId].Latitude;
            var longitude = $scope.cameraInfo[cameraId].Longitude;

            $rootScope.map.animateCamera({
                target: location,
                tilt: 0,
                zoom: groupInfo['zoom'],
                bearing: groupInfo['bearing'],
                duration: 1000
            });
            var marker = $rootScope.markers[cameraId];
            marker.showInfoWindow();

            $scope.requestDate = Date.parse($scope.cameraInfo[cameraId].CreateDate);

            $scope.full_map = false;

            angular.forEach(groupInfo["camera"], function(camera){
                var id = camera['id'];
                $scope.entries.push(
                    {
                        cameraId: $scope.cameraInfo[id].CameraID,
                        latitude: $scope.cameraInfo[id].Latitude,
                        longitude: $scope.cameraInfo[id].Longitude,
                        imageUrl: $scope.cameraInfo[id].CacheImage,
                        createDate: $scope.cameraInfo[id].CreateDate,
                        bearing: groupInfo['bearing'],
                        zoom: groupInfo['zoom'],
                        caption: $scope.cameraInfo[id].Summary
                    }
                );

            })

            $timeout(function() {
                console.log($ionicSlideBoxDelegate.currentIndex())
                $ionicSlideBoxDelegate.update();
                if ($ionicSlideBoxDelegate.currentIndex() > 0)
                {
                    $ionicSlideBoxDelegate.slide(0);
                }

                $ionicLoading.hide();
            }, 50);

            helper.isImage(imageUrl).then(function(result) {
                if (result == false)
                {
                    console.log("data requested")
                    traffic.refreshTrafficInfo().then(function(){
                        $scope.cameraInfo = traffic.getLocalCameraInfo();
                    });
                }
                else
                {
                    console.log("fresh data")
                }
            });
        });
    }

    $scope.refreshImage = function(inCameraId){
        $scope.showCamera(inCameraId)

    }

    $scope.$on('groupSelected', function(event,message) {
        if (message.group_id != "")
        {
            $scope.entries = [];
            traffic.getTrafficGroupInfo().then(function(result){
                var groupInfo = result.data[message.group_id];
                var cameraId = groupInfo["camera"][0]["id"];

                $ionicLoading.show();
                var imageUrl = $scope.cameraInfo[cameraId].ImageURL;
                var latitude = $scope.cameraInfo[cameraId].Latitude;
                var longitude = $scope.cameraInfo[cameraId].Longitude;

                $rootScope.map.animateCamera({
                    target: new plugin.google.maps.LatLng(latitude,longitude),
                    tilt: 0,
                    zoom: groupInfo['zoom'],
                    bearing: groupInfo['bearing'],
                    duration: 1000
                });
                var marker = $rootScope.markers[cameraId];
                marker.showInfoWindow();

                $scope.requestDate = Date.parse($scope.cameraInfo[cameraId].CreateDate);

                $scope.full_map = false;

                angular.forEach(groupInfo["camera"], function(camera){
                    var id = camera['id'];
                    $scope.entries.push(
                        {
                            cameraId: $scope.cameraInfo[id].CameraID,
                            latitude: $scope.cameraInfo[id].Latitude,
                            longitude: $scope.cameraInfo[id].Longitude,
                            imageUrl: $scope.cameraInfo[id].CacheImage,
                            createDate: $scope.cameraInfo[id].CreateDate,
                            bearing: groupInfo['bearing'],
                            zoom: groupInfo['zoom'],
                            caption: $scope.cameraInfo[id].Summary
                        }
                    );

                })

                $timeout(function() {
                    console.log($ionicSlideBoxDelegate.currentIndex())
                    $ionicSlideBoxDelegate.update();
                    if ($ionicSlideBoxDelegate.currentIndex() > 0)
                    {
                        $ionicSlideBoxDelegate.slide(0);
                    }

                    $ionicLoading.hide();
                }, 50);

                console.log(imageUrl)

                helper.isImage(imageUrl).then(function(result) {
                    if (result == false)
                    {
                        console.log("data requested")
                        traffic.refreshTrafficInfo().then(function(){
                            $scope.cameraInfo = traffic.getLocalCameraInfo();
                        });
                    }
                    else
                    {
                        console.log("fresh data")
                    }
                });
            });
        }
    });
})