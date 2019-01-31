"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

var _TypePrimitive = _interopRequireDefault(require("./TypePrimitive"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Type = {
  bool: function bool() {
    return new _TypePrimitive.default(_constants.BOOL, function (val) {
      return typeof val === 'boolean';
    });
  },
  number: function number() {
    return new _TypePrimitive.default(_constants.NUMBER, function (val) {
      return typeof val === 'number';
    });
  },
  string: function string() {
    return new _TypePrimitive.default(_constants.STRING, function (val) {
      return typeof val === 'string';
    });
  },
  object: function object() {
    return new _TypePrimitive.default(_constants.OBJECT, function (val) {
      return !!val && val.constructor.name === 'Object';
    });
  },
  array: function array() {
    return new _TypePrimitive.default(_constants.ARRAY, function (val) {
      return !!val && val.constructor.name === 'Array';
    });
  },
  datetime: function datetime() {
    return new _TypePrimitive.default(_constants.DATETIME, function (val) {
      return !!val && val.constructor.name === 'Date';
    });
  },
  null: function _null() {
    return new _TypePrimitive.default(_constants.NULL, function (val) {
      return val === null;
    });
  },
  undefined: function (_undefined) {
    function undefined() {
      return _undefined.apply(this, arguments);
    }

    undefined.toString = function () {
      return _undefined.toString();
    };

    return undefined;
  }(function () {
    return new _TypePrimitive.default(_constants.UNDEFINED, function (val) {
      return val === undefined;
    });
  }),
  value: function value() {
    var values = Array.prototype.slice.call(arguments);
    return new _TypePrimitive.default(_constants.VALUE, function (val) {
      return values.includes(val);
    });
  },
  custom: function custom(isType) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants.CUSTOM;
    return new _TypePrimitive.default(name, isType);
  }
};
var _default = Type;
exports.default = _default;