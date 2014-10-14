(function(window, undefined){
    'use strict';

    var EQUALITY_PRECISION = 0.0001

    var a = {};
    window.arithmetics = a;

    a.restrictNumber = function restrictNumber(n, min, max){
        if(min>max)
            throw 'make sure to pass min>=max .. ' + [min, max].join(',');

        if(n>=min && n<=max)
            return n;

        if(min!=0) {
            var d = 0-min;
            return restrictNumber(n+d, min+d, max+d) - d;
        }

        n = n % max;
        if(n<0)
            return max+n;

        return n;
    };

    a.floatsAreEqual = function(a, b, precision){
        precision = precision || EQUALITY_PRECISION;
        return Math.abs(a - b) <= precision;
    };


})(window);
