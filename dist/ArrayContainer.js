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
    return val.reduce(function (isMatch, b) {
      if (!isMatch) return isMatch;
      return _this.type.compare(b);
    }, true);
  });

  _defineProperty(this, "validate", function (val) {
    var results = [];
    val.forEach(function (entry, i) {
      var validationResults = _this.type.validate(entry);

      if (results.length > 0) {
        results.push({
          index: i,
          data: validationResults
        });
      }
    });
    return results;
  });

  this.type = type;
};

var _default = ArrayContainer;
exports.default = _default;