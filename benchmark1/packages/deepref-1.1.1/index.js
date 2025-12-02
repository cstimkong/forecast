module.exports = {
  /**
  * Set a deeply nested value of an object
  * This alters the original object
  *
  * @param  {Object} object The object you want to alter
  * @param  {String} path The reference path
  * @param  {*} value The value you want to set
  * @return {Object} object Retuns the altered object
  */
  set: function(object, path, value) {
    var reference = Reference.createFromPath(object, path);
    reference.set(value);
    return reference.resolve();
  }
};

function Reference(pointer, field, parent) {
  this.pointer = pointer;
  this.field = field;
  this.parent = parent || null;
}

Reference.prototype.set = function(value) {
  if (typeof this.field === 'undefined') {
    throw new Error('Cannot set, field is undefined');
    return null;
  }
  this.pointer[this.field] = value;
  return this;
};

Reference.prototype.resolve = function() {
  var reference = this;
  while (reference.parent) {
    reference = reference.getParent();
  }
  return reference.pointer;
};

Reference.createFromPath = function(pointer, path) {
  var reference = new Reference(pointer);
  path = path.split('.');
  path.forEach(function(field) {
    var isNumber = checkIfStringIsNumber(field);
    var hasParent = reference.getParent() ? true : false;
    if (isNumber) {
      field = parseInt(field);
    }

    reference = reference.getChild(field);

    if (isNumber && hasParent) {
      reference.convertToArray();
    }
  });

  return reference;
};

function checkIfStringIsNumber(field) {
  return /^\d+$/.test(field);
}

Reference.prototype.getParent = function() {
  return this.parent || null;
};

Reference.prototype.getChild = function(field) {
  var parent = this;

  if (!this.field) {
    return new Reference(this.pointer, field, parent);
  }

  this.initializeChildAsObject();
  var pointer = this.get();

  return new Reference(pointer, field, parent);
};

Reference.prototype.get = function() {
  if (!this.field) {
    return this.pointer;
  } else {
    return this.pointer[this.field];
  }
};

Reference.prototype.initializeChildAsObject = function() {
  if (this.getType() !== 'object') {
    this.set({});
  }
  return this;
};

Reference.prototype.getType = function(value) {
  return typeof this.pointer[this.field];
};

Reference.prototype.convertToArray = function() {
  if (!this.parent) {
    throw new Error('Cannot convert to array without a parent reference!');
    return null;
  }

  this.pointer = this.parent.convertChildToArray();
};

Reference.prototype.convertChildToArray = function() {
  var child = this.get();
  if (!Array.isArray(child)) {
    this.set([]);
    this.mapKeys(child);
  }
  return this.get();
};

Reference.prototype.mapKeys = function(source) {
  if (typeof source !== 'object') {
    throw new Error('Cannot map from source, source is not an object');
    return null;
  }

  Object.keys(source).forEach(function(key) {
    this.pointer[ this.field ][key] = pointer[key];
  });

  return this;
};



