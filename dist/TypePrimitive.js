"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ArrayContainer = _interopRequireDefault(require("./ArrayContainer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TypePrimitive = function TypePrimitive(_val, isType) {
  var _this = this;

  _classCallCheck(this, TypePrimitive);

  _defineProperty(this, "compare", function (val) {
    if (_this.isOptional && !val) return true;
    return _this.typeChecks.reduce(function (result, check) {
      if (result) return result;
      return check(val);
    }, false);
  });

  _defineProperty(this, "partialCompare", function (val) {
    return _this.compare(val);
  });

  _defineProperty(this, "validate", function (val) {
    var results = {
      invalidTypeFields: []
    };
    if (_this.isOptional && !val) return results;
    if (!_this.compare(val)) results.invalidTypeFields.push(val);
    return results;
  });

  _defineProperty(this, "partialValidate", function (val) {
    return _this.validate(val);
  });

  _defineProperty(this, "or", function (type) {
    if (!(type instanceof TypePrimitive) && !(type instanceof _ArrayContainer.default)) {
      throw 'Unmethod "or" requires type TypePrimitive or type ArrayContainer';
    }

    if (type instanceof TypePrimitive) {
      _this.typeChecks = _toConsumableArray(_this.typeChecks).concat(_toConsumableArray(type.typeChecks));
    } else if (type instanceof _ArrayContainer.default) {
      _this.typeChecks = _toConsumableArray(_this.typeChecks).concat([type.compare]);
    }

    return _this;
  });

  _defineProperty(this, "optional", function () {
    _this.isOptional = true;
    return _this;
  });

  this.value = _val;
  this.typeChecks = [isType];
  this.isOptional = false;
};

var _default = TypePrimitive;
exports.default = _default;