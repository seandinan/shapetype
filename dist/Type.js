"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Type = {
  bool: function bool() {
    return new TypePrimitive(BOOL, function (val) {
      return typeof val === 'boolean';
    });
  },
  number: function number() {
    return new TypePrimitive(NUMBER, function (val) {
      return typeof val === 'number';
    });
  },
  string: function string() {
    return new TypePrimitive(STRING, function (val) {
      return typeof val === 'string';
    });
  },
  object: function object() {
    return new TypePrimitive(OBJECT, function (val) {
      return val.constructor.name === 'Object';
    });
  },
  array: function array() {
    return new TypePrimitive(ARRAY, function (val) {
      return val.constructor.name === 'Array';
    });
  },
  datetime: function datetime() {
    return new TypePrimitive(DATETIME, function (val) {
      return val.constructor.name === 'Date';
    });
  },
  null: function _null() {
    return new TypePrimitive(NULL, function (val) {
      return val === null;
    });
  },
  undefined: function undefined() {
    return new TypePrimitive(UNDEFINED, function (val) {
      return val === null;
    });
  },
  custom: function custom(isType) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CUSTOM;
    return new TypePrimitive(name, isType);
  }
};
var _default = Type;
exports.default = _default;