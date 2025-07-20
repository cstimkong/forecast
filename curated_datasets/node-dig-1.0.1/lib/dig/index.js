function dig(object, keys, value) {
  const key = keys.shift();
  if (keys.length == 0) {
    return value ? (object[key] = value) : object[key];
  }

  if (!(key in object)) {
    object[key] = {};
  }

  return dig(object[key], keys, value);
}

module.exports = dig;
