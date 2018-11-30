"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineShape = defineShape;
exports.extendShape = extendShape;
exports.arrayOf = arrayOf;
Object.defineProperty(exports, "Type", {
  enumerable: true,
  get: function get() {
    return _Type.default;
  }
});

var _ArrayContainer = _interopRequireDefault(require("./ArrayContainer"));

var _Shape = _interopRequireDefault(require("./Shape"));

var _Type = _interopRequireDefault(require("./Type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function defineShape(shape) {
  return new _Shape.default(shape);
}

function extendShape(shape, data) {
  return new _Shape.default(_objectSpread({}, shape.shape, data));
}

function arrayOf(val) {
  return new _ArrayContainer.default(val);
}