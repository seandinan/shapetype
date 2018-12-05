"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ArrayContainer = _interopRequireDefault(require("./ArrayContainer"));

var _TypePrimitive = _interopRequireDefault(require("./TypePrimitive"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Shape = function Shape(shape) {
  var _this = this;

  _classCallCheck(this, Shape);

  _defineProperty(this, "compare", function (obj) {
    return Object.keys(obj).reduce(function (isMatch, key) {
      if (!isMatch) return isMatch; // Already been shown to be false

      if (!_this.shape[key]) return false; // Key missing from reference shape

      var is = function is(instance) {
        return _this.shape[key] instanceof instance;
      };

      var isShapeOrType = is(_TypePrimitive.default) || is(Shape) || is(_ArrayContainer.default);

      if (isShapeOrType || _this.shape[key].constructor.name === 'Object') {
        return _this.shape[key].compare(obj[key]);
      } else return obj[key] === _this.shape[key];
    }, true);
  });

  _defineProperty(this, "validate", function (obj) {
    var keys = Object.keys(obj);
    var results = {
      missingFields: [],
      extraFields: [],
      invalidTypeFields: []
    }; // Determine if the value has shapetype methods

    var is = function is(key) {
      return function (instance) {
        return _this.shape[key] instanceof instance;
      };
    };

    var isShapeOrType = function isShapeOrType(key) {
      return is(key)(_TypePrimitive.default) || is(key)(Shape) || is(key)(_ArrayContainer.default);
    }; // Check for keys defined by the Shape but missing from the object


    results.missingFields = Object.keys(_this.shape).filter(function (k) {
      return !keys.includes(k);
    }); // Validate each key in the object

    keys.forEach(function (key) {
      // key isn't defined in the Shape
      if (!_this.shape[key]) {
        results.extraFields.push(key);
      } else if (isShapeOrType(key) || _this.shape[key].constructor.name === 'Object') {
        if (!_this.shape[key].compare(obj[key])) {
          results.invalidTypeFields.push(key);
        }

        ;
      } else if (obj[key] !== _this.shape[key]) {
        results.invalidTypeFields.push(key);
      }
    });
    return results;
  });

  this.shape = shape;
};

var _default = Shape;
exports.default = _default;