function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}

var Utils = {
    isFunction: function () {
        var tag = isObject(value) ? objectToString.call(value) : '';
        return tag == funcTag || tag == genTag;
    },
    isRegExp: function () {

    },
    find: function () {

    },
    each: function () {

    }
}
module.exports = Utils;
