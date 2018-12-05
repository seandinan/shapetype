# ShapeType

Define shapes and types and use them for data/structure validation.

---
## API

### `Type`
Types allow you to define what type of data you expect a value to be.

#### Type Definitions:
- `Type.bool()` for a boolean value     
- `Type.number()` for a number
- `Type.string()` for a string
- `Type.datetime()` for a Date object
- `Type.null()` for a null value
- `Type.undefined()` for an undefined value
- `Type.object()` for an object literal
    - _Note:_ You'll often want to use a `Shape` instead of `Type.object()` (see below).   
- `Type.array()` for an array.
    - _Note:_ You'll often want to use `arrayOf()` instead of `Type.array()`(see below).  
- `Type.custom(isType[, name])` allows you to define a custom Type.
    - `isType` should be a method that accepts a value and returns a boolean.
    - `name` is an optional value that will be stored as `Type.value` internally.
    - _Example:_ `const EmailType = Type.custom(val => isEmail(val), 'EMAIL');` 

#### Type Methods
- `.compare(val)` returns `true`/`false` whether `val` matches the Type.
    - _Example:_ 
        - `EmailType.compare('test@test.com') ~ true`
        - `EmailType.compare('test=test') ~ false`
- `.validate(val)` returns an validation object assessing whether `val` matches the Type.
    - _Example:_ 
        - `EmailType.validate('test@test.com') ~ { invalidTypeFields: [] }`
        - `EmailType.validate('test=test') ~ { invalidTypeFields: [ 'test=test' ] }` 
- `.or()` allows you to chain a list of Types together
    - _Example:_ `const assignedTo = Type.number().or(Type.null())` 

--- 

### `arrayOf(Type|Shape)`
Indicates that there is an array of the provided value.

When `validate` is called on a value defined by `arrayOf()`, an empty array will be returned if all values pass their tests. An array of validation objects with an additional `index` key will be returned if any of the array's values do not pass their test. 

---

### `defineShape`
Returns a `Shape` when provided with an object of key/`Type` pairs.

```ecmascript 6
const User = defineShape({
  id: Type.number(),
  name: Type.string(),
  assignedTo: Type.number().or(Type.null()),
})
```

You can also nest Shapes within other Shapes.
```ecmascript 6
const Event = defineShape({
  id: Type.number(),
  name: Type.string(),
  createdBy: User,
  guests: arrayOf(User),
})
```

#### Shape Methods

- `.compare(obj)` returns `true`/`false` whether `obj` matches the pattern defined by the `Shape`.
    - _Example:_ 
        - `User.compare({ id: 2, name: 'Test', assignedTo: 12 }) ~ true`
        - `User.compare({ id: 2, name: 'Test', assignedTo: 'Joe' }) ~ false`
- `.validate(obj)` returns a validation object reflecting the test results of the individual values defined by the shape.
    - The validation object consists of three arrays:
        - `missingFields`: fields that are defined in the Shape but missing from the object
        - `extraFields`: fields that are not defined in the Shape but are included in the object
        - invalidTypeFields: fields that don't match the Type defined by the Shape
    - _Example:_ 
        - `User.validate({ id: 2, name: 'Test', assignedTo: 12 }) ~ { missingFields: [], extraFields: [], invalidTypeFields: [] }`
        - `User.validate({ id: 2, name: 'Test', assignedTo: 'Joe' }) ~ { missingFields: [], extraFields: [], invalidTypeFields: [ 'assignedTo' ] }`
        - `User.validate({ name: 'Test', assignedTo: 12 }) ~ { missingFields: [ 'id ], extraFields: [], invalidTypeFields: [] }`
       - `User.validate({ id: 2, name: 'Test', assignedTo: 12, isDog: true }) ~ { missingFields: [], extraFields: [ 'isDog' ], invalidTypeFields: [] }`

--- 

### `extendShape(existingShape, obj)`

Allows you to build off of an existing shape. A new `Shape` instance will be returned.

```ecmascript 6
const Rectangle = defineShape({
  length: Type.number(),
  width: Type.number(),
});

const Box = extendShape(Rectangle, { height: Type.number() });
```

--- 

## Additional Examples

### Usage in testing

You can use Shapes with a testing library such as [Jest](https://github.com/facebook/jest) for type assertions.

```ecmascript 6
it ('should return the user', () => {
  expect(UserShape.compare(user)).toEqual(true);	
});
```

### Usage in field validation

```ecmascript 6
const missingFields = UserShape.validate(user));
if (missingFields.length > 0){
  onError(missingFields);
} else {
  onSave(user);
}
```
