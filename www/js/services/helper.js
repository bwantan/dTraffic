angular.module('app.services').service('helper', function ($ionicBackdrop, $q) {

    return (
    {

        setMapClickable: setMapClickable,
        isImage: isImage

    });

    function setMapClickable($rootScope, enabled){
        if (window.cordova)
        {
            if ($rootScope.map != null)
            {
                $rootScope.map.setClickable(enabled);
            }

        }
    };

    function isImage(src) {

        var deferred = $q.defer();

        var image = new Image();
        image.onerror = function() {
            deferred.resolve(false);
        };
        image.onload = function() {
            deferred.resolve(true);
        };
        image.src = src;

        return deferred.promise;
    }

})
