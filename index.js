'use strict';

const isExist = function isExist(variable) {
  return (typeof variable !== 'undefined' && variable !== null);
};

const exist = function exist(obj, nestedProp) {
  return isExist(exist.get(obj, nestedProp));
};

const rxAccess = /[\[\]\.]+/;
exist.get = function get(obj, props, defaultValue) {
  if (!isExist(obj)) {
    return defaultValue;
  }

  if (!Array.isArray(props)) {
    props = props.split(rxAccess);
  }

  let prev = obj;
  for (let prop of props) {
    if (!prop) continue;

    const curr = prev[prop];
    if (!isExist(curr)) {
      return defaultValue;
    }
    prev = curr;
  }

  return prev;
};

exist.set = function set(obj, nestedProp, value) {
  const props = nestedProp.split(rxAccess);
  const ownee = props.pop();

  const owner = exist.get(obj, props);
  if (isExist(owner)) {
    owner[ownee] = value;
    return true;
  } else {
    return false;
  }
};

const NOOP = function() {};
exist.invoke = function invoke(obj, nestedMethod) {
  const method = exist.get(obj, nestedMethod);
  if (typeof method === 'function') {
    return method;
  }
  return NOOP;
};

module.exports = exist;
