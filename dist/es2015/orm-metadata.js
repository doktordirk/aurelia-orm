var _class, _temp;

import typer from 'typer';
import { inject, transient, Container } from 'aurelia-dependency-injection';
import { Config } from 'aurelia-api';
import { metadata } from 'aurelia-metadata';
import { Validation, ValidationGroup } from 'aurelia-validation';
import { getLogger } from 'aurelia-logging';

export let OrmMetadata = class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
  }
};

export let Metadata = (_temp = _class = class Metadata {
  constructor() {
    this.metadata = {
      repository: DefaultRepository,
      resource: null,
      endpoint: null,
      name: null,
      idProperty: 'id',
      associations: {}
    };
  }

  addTo(key, value) {
    if (typeof this.metadata[key] === 'undefined') {
      this.metadata[key] = [];
    } else if (!Array.isArray(this.metadata[key])) {
      this.metadata[key] = [this.metadata[key]];
    }

    this.metadata[key].push(value);

    return this;
  }

  put(key, valueOrNestedKey, valueOrNull) {
    if (!valueOrNull) {
      this.metadata[key] = valueOrNestedKey;

      return this;
    }

    if (typeof this.metadata[key] !== 'object') {
      this.metadata[key] = {};
    }

    this.metadata[key][valueOrNestedKey] = valueOrNull;

    return this;
  }

  has(key, nested) {
    if (typeof nested === 'undefined') {
      return typeof this.metadata[key] !== 'undefined';
    }

    return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
  }

  fetch(key, nested) {
    if (!nested) {
      return this.has(key) ? this.metadata[key] : null;
    }

    if (!this.has(key, nested)) {
      return null;
    }

    return this.metadata[key][nested];
  }
}, _class.key = 'spoonx:orm:metadata', _temp);