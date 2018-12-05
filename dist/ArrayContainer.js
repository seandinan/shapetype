"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ArrayContainer = function ArrayContainer(type) {
  var _this = this;

  _classCallCheck(this, ArrayContainer);

  _defineProperty(this, "compare", function (val) {
    if (!val.reduce) return false;
    return val.reduce(function (isMatch, b) {
      if (!isMatch) return isMatch;
      return _this.type.compare(b);
    }, true);
  });

  _defineProperty(this, "validate", function (val) {
    var results = [];
    if (!val.forEach) throw TypeError('ArrayContainer requires an array for comparison');
    val.forEach(function (entry, i) {
      var _this$type$validate = _this.type.validate(entry),
          missingFields = _this$type$validate.missingFields,
          extraFields = _this$type$validate.extraFields,
          invalidTypeFields = _this$type$validate.invalidTypeFields;

      if (missingFields.length > 0 || extraFields.length > 0 || invalidTypeFields.length > 0) {
        results.push({
          index: i,
          missingFields: missingFields,
          extraFields: extraFields,
          invalidTypeFields: invalidTypeFields
        });
      }
    });
    return results;
  });

  this.type = type;
};

var _default = ArrayContainer;
exports.default = _default;