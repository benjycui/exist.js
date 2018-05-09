'use strict';

function warn(msg) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(msg);
    }
  }
}

const isExist = function isExist(variable) {
  return variable !== undefined && variable !== null;
};

const rxAccess = /[\[\]\.]+/;
const baseGet = function baseGet(obj, nestedProp, createMissing) {
  if (!isExist(obj)) return {};

  const props = Array.isArray(nestedProp) ? nestedProp : nestedProp.split(rxAccess);

  let prev = null;
  let curr = obj;
  const path = [];
  for (let i in props) {
    const prop = props[i];
    if (prop.length === 0) continue;

    prev = curr;
    curr = curr[prop];
    path.push(prop);
    if (!isExist(curr)) {
      if (createMissing) {
        prev[prop] = {};
        curr = prev[prop];
      } else {
        return {
          path: path,
        };
      }
    }
  }

  return {
    value: curr,
    path: path,
  };
};

const exist = function exist(obj, nestedProp) {
  warn('`exist()` is deprecated, please use `exist.detect()`.');
  return isExist(baseGet(obj, nestedProp).value);
};

exist.detect = function detect(obj, nestedProp) {
  const wrappedValue = baseGet(obj, nestedProp);
  if (!isExist(wrappedValue.value)) {
    return wrappedValue.path;
  }
  return true;
};

exist.get = function get(obj, nestedProp, defaultValue) {
  const value = baseGet(obj, nestedProp).value;
  return isExist(value) ? value : defaultValue;
};

exist.set = function set(obj, nestedProp, value, createMissing) {
  const props = Array.isArray(nestedProp) ? nestedProp : nestedProp.split(rxAccess);
  const ownee = props.pop();

  const owner = baseGet(obj, props, createMissing).value;
  if (isExist(owner)) {
    owner[ownee] = value;
    return true;
  } else {
    return false;
  }
};

const NOOP = function() {};
exist.invoke = function invoke(obj, nestedMethod) {
  const props = Array.isArray(nestedMethod) ? nestedMethod : nestedMethod.split(rxAccess);
  const ownee = props.pop();

  const owner = baseGet(obj, props).value;
  if (isExist(owner)) {
    const method = owner[ownee];
    if (typeof method === 'function') {
      return method.bind(owner);
    }
  }
  return NOOP;
};

module.exports = exist;
