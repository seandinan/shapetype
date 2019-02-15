var ShapeType = require('./dist/ShapeType');

module.exports = {
  Type       : ShapeType.Type,
  defineShape: ShapeType.defineShape,
  extendShape: ShapeType.extendShape,
  arrayOf    : ShapeType.arrayOf,
  optional   : ShapeType.optional,
};
