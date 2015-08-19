# exist.js

If you are tired of those:

```js
// To get `name`, but you do not know whether `employees` and `employees[0]` exist or not
const name = (company.employees && company.employees[0] && company.employees[0].name);

// To set `name`, but you do not know whether `employees` and `employees[0]` exist or not
if (company.employees && company.employees[0]) {
  company.employees[0].name = 'Benjy';
}

// To call a method of nested `Object`
if (company.employees && company.employees[0] && (typeof company.employees[0].getName === 'function')) {
  var name = company.employees[0].getName();
}
```

You can try **exist.js**. Something inspired by the existential operator(`?.` & `?()`) of [CoffeeScript](http://coffeescript.org/), but not the same as it. With exist.js, you can access nested property easily:

```js
// To get `name`, but you do not know whether `employees` and `employees[0]` exist or not
const name = exist.get(company, 'employees[0].name');

// To set `name`, but you do not know whether `employees` and `employees[0]` exist or not
exist.set(company, 'employees[0].name', 'Benjy');

// To call a method of nested `Object`
exist.call(company, 'employees[0].getName')();
```


## API

### exist(obj, nestedProp)

> (Object, String) -> boolean

To check whether a nested property exists in `Object` or not.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

exist(company, 'employees[0].name') // => true
exist(company, 'employees[0].age') // => false
```


### exist.get(obj, nestedProp[, defaultValue])

> (Object, String[, anything]) -> undefined | value

To get a nested property. If this property does not exist, return `undefined` or `defaultValue`.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

exist.get(company, 'employees[0].name') // => 'Benjy'
exist.get(company, 'employees[0].age') // => undefined
exist.get(company, 'employees[0].age', 18) // => 18
```


### exist.set(obj, nestedProp, value)

> (Object, String, anything) -> boolean

To set a value to nested property. If success, return `true`. Otherwise, `false`.

```js
const company = {
  employees: [{}]
};

exist.set(company, 'employees[0].name', 'Benjy') // => true
exist.set(company, 'stockholders[0].name', 'Benjy') // => false, for `stockholders` does not exist
```


### exist.call(obj, nestedMethod)

> (Object, String) -> Function

To get a nested method, or return NOOP(`function() {}`) if this property does not exist.

```js
const company = {
  employees: [
    {
      name: 'Benjy',
      sayHi: function(name) {
        console.log('Nice to meet you, ' + name + '!');
      }
    }
  ]
};

exist.call(company, 'employees[0].sayHi')('Bob') // => 'Nice to meet you, Bob!'
exist.call(company, 'employees[0].sayHello')('Bob') // => Nothing will happen
```

## License

MIT
