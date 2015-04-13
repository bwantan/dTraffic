angular.module('app.services').service('traffic', function ($http, $q, $localstorage) {
    var cameraImageSet = {};
    var groupInfo = undefined;
    var dataRefresh = false;
    var api = "http://demo.boonwan.com/dTraffic/api";
    var lta = ""
    return (
    {
        getLocalCameraInfo:getLocalCameraInfo,
        getCameraInfo: getCameraInfo,
        resetCameraInfo: resetCameraInfo,
        getTrafficGroupInfo: getTrafficGroupInfo,
        refreshTrafficInfo: refreshTrafficInfo

    });

    function resetCameraInfo(){
        $localstorage.clear();
    }

    function getTrafficGroupInfo(){
        return $http.get('data/groupInfo.json').success(function(result){
            groupInfo = result;
            return groupInfo;
        });
    }

    function getLocalCameraInfo(){

        if ($localstorage.getObject("CameraImageSet") != undefined)
        {
            cameraImageSet = $localstorage.getObject("CameraImageSet");
        }

        return cameraImageSet;
    }

    function setLocalCameraInfo(inCameraInfo){
        cameraImageSet = inCameraInfo;
        $localstorage.setObject("CameraImageSet", cameraImageSet);
    }

    function getCameraInfo( ) {
        var request = $http({
            method: "GET",
            url: api + '/camera'
        });

        return( request.then( function(response){

            angular.forEach(response.data.camera, function(entry){

                cameraImageSet[entry['camera_id']] = {
                    CameraID: entry['camera_id'],
                    Latitude: entry['latitude'],
                    Longitude: entry['longitude'],
                    ImageURL: entry['image_url'],
                    CacheImage: 'http://demo.boonwan.com/dTraffic/api/camera/' + entry['camera_id'],
                    CreateDate: entry['created_date'],
                    Summary: entry['summary'],
                    Group_Id: entry['group_id']
                };
            })

            setLocalCameraInfo(cameraImageSet);
            return cameraImageSet;
        }, handleError ) );

    }

    function refreshTrafficInfo( ) {
        var request = $http({
            method: "GET",
            url: api + '/lta_traffic_info'
        });

        return( request.then( function(response){
            console.log("success")
            getCameraInfo();
        }, handleError ) );

    }

    function handleSuccess( response ) {

        return( response.data );

    }

    function handleError( response ) {

        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
        ) {

            return( $q.reject( "An unknown error occurred." ) );

        }

        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );

    }
})
