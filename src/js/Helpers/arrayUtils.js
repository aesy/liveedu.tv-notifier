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

    contains: function(needle, haystack, case_sensitive) {
        if (!case_sensitive) {
            needle = needle.toLowerCase();
            haystack = haystack.map(function(val) {
                return val.toLowerCase();
            });
        }

        return haystack.indexOf(needle) > -1;
    },

    diff: function(arr1, arr2) {
        var onlyInArr1 = arr1.filter(function (val) {
            return !this.contains(val, arr2);
        });

        var onlyInArr2 = arr2.filter(function (val) {
            return !this.contains(val, arr1);
        });

        return onlyInArr1.concat(onlyInArr2);
    },

    intersection: function(arr1, arr2) {
        return arr1.filter(function(val) {
            return this.contains(val, arr2);
        });
    },

    union: function(arr1, arr2) {
        return this.unique(arr1.concat(arr2));
    },

    unique: function(arr) {
        return arr.filter(function(val, key) {
            return arr.indexOf(val) === key;
        });
    }
};
