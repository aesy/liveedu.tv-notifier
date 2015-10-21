var Helpers = Helpers || {};

Helpers.general = {
    compare: function (obj1, obj2) {
        if (typeof obj1 !== typeof obj2)
            return false;

        if (angular.isArray(obj1))
            return Helpers.array.compare(obj1, obj2);
        else if (angular.isObject())
            return Helpers.object.compare(obj1, obj2);
        else if (angular.isFunction())
            return obj1.toString() === obj2.toString();

        return obj1 === obj2;
    }
};