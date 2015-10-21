var Helpers = Helpers || {};

Helpers.object = {
    merge: function(obj1, obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }

        return obj1;
    },

    isEmpty: function(obj) {
        return Object.keys(obj).length === 0;
    },

    compare: function (obj1, obj2) {
        return angular.equals(obj1, obj2);
    }
};