
myApp.directive('activeLink', ['$location', function (location) {
    //create menu active links
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = attrs.href;
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {

                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    };
}]);

