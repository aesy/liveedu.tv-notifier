var Helpers = Helpers || {};

Helpers.array = {
    all: function(array) {
        for (var i in array) {
            if (!array[i])
                return false;
        }

        return true;
    },

    any: function(array) {
        for (var i in array) {
            if (array[i])
                return true;
        }

        return false;
    },

    removeValue: function(array, value) {
        var index = array.indexOf(value);

        if (index > -1) {
            array = this.removeKey(array, index);
        }

        return array;
    },

    removeKey: function(array, key) {
        array.splice(key, 1);

        return array;
    },

    toLowerCase: function (arr) {
        return arr.map(function (val) {
            if (angular.isString(val))
                return val.toLowerCase();

            return val;
        });
    },

    compare: function(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;

        for (var i in arr1) {
            if (!Helpers.general.compare(arr1[i], arr2[i]))
                return false;
        }

        return true;
    },

    containsString: function (needle, haystack, case_sensitive) {
        if (!case_sensitive) {
            needle = needle.toLowerCase();
            haystack = this.toLowerCase(haystack);
        }

        return haystack.indexOf(needle) > -1;
    },

    contains: function(obj1, arr, case_sensitive) {
        if (angular.isString(obj1))
            return this.containsString(obj1, arr, case_sensitive);

        for (var obj2 in arr) {
            if (Helpers.general.compare(obj1, obj2))
                return true;
        }

        return false;
    },

    property: function(property, arr) {
        arr.filter(function(val) {
            return angular.isObject(val);
        });

        return arr.map(function(val) {
            return val[property];
        });
    },

    diff: function(arr1, arr2) {
        var onlyInArr1 = arr1.filter(function (val) {
            return !this.contains(val, arr2);
        }.bind(this));

        var onlyInArr2 = arr2.filter(function (val) {
            return !this.contains(val, arr1);
        }.bind(this));

        return onlyInArr1.concat(onlyInArr2);
    },

    intersection: function(arr1, arr2) {
        return arr1.filter(function(val) {
            return this.contains(val, arr2);
        }.bind(this));
    },

    union: function(arr1, arr2) {
        return this.unique(arr1.concat(arr2));
    },

    unique: function(arr) {
        return arr.filter(function(val, key) {
            return arr.indexOf(val) === key;
        }.bind(this));
    }
};
