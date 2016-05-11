'use strict';

const isExist = function isExist(variable) {
  return (variable !== undefined && variable !== null);
};

const rxAccess = /[\[\]\.]+/;
const baseGet = function baseGet(obj, nestedProp) {
  if (!isExist(obj)) return;

  const props = Array.isArray(nestedProp) ? nestedProp : nestedProp.split(rxAccess);

  let curr = obj;
  for (let prop of props) {
    if (prop.length === 0) continue;

    curr = curr[prop];
    if (!isExist(curr)) return;
  }

  return curr;
};

const exist = function exist(obj, nestedProp) {
  return isExist(baseGet(obj, nestedProp));
};

exist.get = function get(obj, nestedProp, defaultValue) {
  const value = baseGet(obj, nestedProp);
  return isExist(value) ? value : defaultValue;
};

exist.set = function set(obj, nestedProp, value) {
  const props = Array.isArray(nestedProp) ? nestedProp : nestedProp.split(rxAccess);
  const ownee = props.pop();

  const owner = baseGet(obj, props);
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

  const owner = baseGet(obj, props);
  if (isExist(owner)) {
    const method = owner[ownee];
    if (typeof method === 'function') {
      return method.bind(owner);
    }
  }
  return NOOP;
};

module.exports = exist;
