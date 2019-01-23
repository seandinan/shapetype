"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ArrayContainer = _interopRequireDefault(require("./ArrayContainer"));

var _TypePrimitive = _interopRequireDefault(require("./TypePrimitive"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Shape = function Shape(shape) {
  var _this = this;

  _classCallCheck(this, Shape);

  _defineProperty(this, "compare", function (obj) {
    return compare(_this.shape, obj);
  });

  _defineProperty(this, "partialCompare", function (obj) {
    return compare(getPartialShape(_this.shape, obj), obj);
  });

  _defineProperty(this, "validate", function (obj) {
    return validate(_this.shape, obj);
  });

  _defineProperty(this, "partialValidate", function (obj) {
    return validate(getPartialShape(_this.shape, obj), obj);
  });

  this.shape = shape;
};

function getPartialShape(shape, obj) {
  var objectKeys = Object.keys(obj);
  var shapeKeys = Object.keys(shape);

  var refShape = _objectSpread({}, shape); // shallow clone


  shapeKeys.forEach(function (key) {
    if (!objectKeys.includes(key)) delete refShape[key];
  });
  return refShape;
}

function compare(refShape, obj) {
  var objectKeys = Object.keys(obj);
  var shapeKeys = Object.keys(refShape);
  var isNoExtraFields = objectKeys.reduce(function (isOK, key) {
    return isOK ? shapeKeys.includes(key) : isOK;
  }, true);
  var isAllRequiredFieldsPresent = shapeKeys.reduce(function (isOK, key) {
    if (!isOK) return isOK; // Confirm that every non-optional field in this.shape is in obj

    return refShape[key].isOptional || objectKeys.includes(key);
  }, true);
  if (!isNoExtraFields || !isAllRequiredFieldsPresent) return false;
  var isAllFieldsCorrectType = objectKeys.reduce(function (isOK, key) {
    if (!isOK) return isOK;

    var is = function is(instance) {
      return refShape[key] instanceof instance;
    };

    var isShapeOrType = is(_TypePrimitive.default) || is(Shape) || is(_ArrayContainer.default);

    if (isShapeOrType || refShape[key].constructor.name === 'Object') {
      return refShape[key].compare(obj[key]);
    } else return obj[key] === refShape[key];
  }, true);
  return isAllFieldsCorrectType;
}

function validate(refShape, obj) {
  var keys = Object.keys(obj);
  var results = {
    missingFields: [],
    extraFields: [],
    invalidTypeFields: []
  }; // Determine if the value has shapetype methods

  var is = function is(key) {
    return function (instance) {
      return refShape[key] instanceof instance;
    };
  };

  var isShapeOrType = function isShapeOrType(key) {
    return is(key)(_TypePrimitive.default) || is(key)(Shape) || is(key)(_ArrayContainer.default);
  }; // Check for keys defined by the Shape but missing from the object


  results.missingFields = Object.keys(refShape).filter(function (k) {
    var isOptional = refShape[k].isOptional;
    var isMissingFromObject = !keys.includes(k);
    return !isOptional && isMissingFromObject;
  }); // Validate each key in the object

  keys.forEach(function (key) {
    // key isn't defined in the Shape
    if (!refShape[key]) {
      results.extraFields.push(key);
    } else if (isShapeOrType(key) || refShape[key].constructor.name === 'Object') {
      if (!refShape[key].compare(obj[key])) {
        results.invalidTypeFields.push(key);
      }

      ;
    } else if (obj[key] !== refShape[key]) {
      results.invalidTypeFields.push(key);
    }
  });
  return results;
}

var _default = Shape;
exports.default = _default;