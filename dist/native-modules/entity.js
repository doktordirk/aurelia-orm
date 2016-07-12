var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _dec2, _class;



import typer from 'typer';
import { inject, transient, Container } from 'aurelia-dependency-injection';
import { Config } from 'aurelia-api';
import { metadata } from 'aurelia-metadata';
import { Validation, ValidationGroup } from 'aurelia-validation';
import { getLogger } from 'aurelia-logging';

export var Entity = (_dec = transient(), _dec2 = inject(Validation), _dec(_class = _dec2(_class = function () {
  function Entity(validator) {
    

    this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);

    if (!this.hasValidation()) {
      return this;
    }

    return this.define('__validator', validator);
  }

  Entity.prototype.getTransport = function getTransport() {
    return this.getRepository().getTransport();
  };

  Entity.prototype.getRepository = function getRepository() {
    return this.__repository;
  };

  Entity.prototype.setRepository = function setRepository(repository) {
    return this.define('__repository', repository);
  };

  Entity.prototype.define = function define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  };

  Entity.prototype.getMeta = function getMeta() {
    return this.__meta;
  };

  Entity.prototype.getIdProperty = function getIdProperty() {
    return this.getMeta().fetch('idProperty');
  };

  Entity.getIdProperty = function getIdProperty() {
    var idProperty = OrmMetadata.forTarget(this).fetch('idProperty');

    return idProperty;
  };

  Entity.prototype.getId = function getId() {
    return this[this.getIdProperty()];
  };

  Entity.prototype.setId = function setId(id) {
    this[this.getIdProperty()] = id;

    return this;
  };

  Entity.prototype.save = function save() {
    var _this = this;

    if (!this.isNew()) {
      return this.update();
    }

    var response = void 0;
    return this.getTransport().create(this.getResource(), this.asObject(true)).then(function (created) {
      _this.setId(created[_this.getIdProperty()]);
      response = created;
    }).then(function () {
      return _this.saveCollections();
    }).then(function () {
      return _this.markClean();
    }).then(function () {
      return response;
    });
  };

  Entity.prototype.update = function update() {
    var _this2 = this;

    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    if (this.isClean()) {
      return this.saveCollections().then(function () {
        return _this2.markClean();
      }).then(function () {
        return null;
      });
    }

    var requestBody = this.asObject(true);
    var response = void 0;

    delete requestBody[this.getIdProperty()];

    return this.getTransport().update(this.getResource(), this.getId(), requestBody).then(function (updated) {
      return response = updated;
    }).then(function () {
      return _this2.saveCollections();
    }).then(function () {
      return _this2.markClean();
    }).then(function () {
      return response;
    });
  };

  Entity.prototype.addCollectionAssociation = function addCollectionAssociation(entity, property) {
    var _this3 = this;

    property = property || getPropertyForAssociation(this, entity);
    var url = [this.getResource(), this.getId(), property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      var associationProperty = getPropertyForAssociation(entity, this);
      var relation = entity.getMeta().fetch('association', associationProperty);

      if (!relation || relation.type !== 'entity') {
        return entity.save().then(function () {
          if (entity.isNew()) {
            throw new Error('Entity did not return return an id on saving.');
          }

          return _this3.addCollectionAssociation(entity, property);
        });
      }

      entity[associationProperty] = this.getId();

      return entity.save().then(function () {
        return entity;
      });
    }

    url.push(entity.getId());

    return this.getTransport().create(url.join('/')).then(function () {
      return entity;
    });
  };

  Entity.prototype.removeCollectionAssociation = function removeCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    var idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.getId()) {
        return Promise.resolve(null);
      }

      idToRemove = entity.getId();
    }

    return this.getTransport().destroy([this.getResource(), this.getId(), property, idToRemove].join('/'));
  };

  Entity.prototype.saveCollections = function saveCollections() {
    var _this4 = this;

    var tasks = [];
    var currentCollections = getCollectionsCompact(this, true);
    var cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

    var addTasksForDifferences = function addTasksForDifferences(base, candidate, method) {
      if (base === null) {
        return;
      }

      Object.getOwnPropertyNames(base).forEach(function (property) {
        base[property].forEach(function (id) {
          if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
            tasks.push(method.call(_this4, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(function (results) {
      return _this4;
    });
  };

  Entity.prototype.markClean = function markClean() {
    var cleanValues = getFlat(this);
    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  };

  Entity.prototype.isClean = function isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  };

  Entity.prototype.isDirty = function isDirty() {
    return !this.isClean();
  };

  Entity.prototype.isNew = function isNew() {
    return typeof this.getId() === 'undefined';
  };

  Entity.prototype.reset = function reset(shallow) {
    var _this5 = this;

    var pojo = {};
    var metadata = this.getMeta();

    Object.keys(this).forEach(function (propertyName) {
      var value = _this5[propertyName];
      var association = metadata.fetch('associations', propertyName);

      if (!association || !value) {
        pojo[propertyName] = value;

        return;
      }
    });

    if (this.isClean()) {
      return this;
    }

    var isNew = this.isNew();
    var associations = this.getMeta().fetch('associations');

    Object.keys(this).forEach(function (propertyName) {
      if (Object.getOwnPropertyNames(associations).indexOf(propertyName) === -1) {
        delete _this5[propertyName];
      }
    });

    if (isNew) {
      return this.markClean();
    }

    this.setData(this.__cleanValues.data.entity);

    if (shallow) {
      return this.markClean();
    }

    var collections = this.__cleanValues.data.collections;

    Object.getOwnPropertyNames(collections).forEach(function (index) {
      _this5[index] = [];
      collections[index].forEach(function (entity) {
        if (typeof entity === 'number') {
          _this5[index].push(entity);
        }
      });
    });

    return this.markClean();
  };

  Entity.getResource = function getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  };

  Entity.prototype.getResource = function getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  };

  Entity.prototype.setResource = function setResource(resource) {
    return this.define('__resource', resource);
  };

  Entity.prototype.destroy = function destroy() {
    if (!this.getId()) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.getId());
  };

  Entity.prototype.getName = function getName() {
    var metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  };

  Entity.getName = function getName() {
    var metaName = OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  };

  Entity.prototype.setData = function setData(data, markClean) {
    Object.assign(this, data);

    if (markClean) {
      this.markClean();
    }

    return this;
  };

  Entity.prototype.enableValidation = function enableValidation() {
    if (!this.hasValidation()) {
      throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
    }

    if (this.__validation) {
      return this;
    }

    return this.define('__validation', this.__validator.on(this));
  };

  Entity.prototype.getValidation = function getValidation() {
    if (!this.hasValidation()) {
      return null;
    }

    if (!this.__validation) {
      this.enableValidation();
    }

    return this.__validation;
  };

  Entity.prototype.hasValidation = function hasValidation() {
    return !!this.getMeta().fetch('validation');
  };

  Entity.prototype.asObject = function asObject(shallow) {
    return _asObject(this, shallow);
  };

  Entity.prototype.asJson = function asJson(shallow) {
    return _asJson(this, shallow);
  };

  return Entity;
}()) || _class) || _class);

function _asObject(entity, shallow) {
  var pojo = {};
  var metadata = entity.getMeta();

  Object.keys(entity).forEach(function (propertyName) {
    var value = entity[propertyName];
    var association = metadata.fetch('associations', propertyName);

    if (!association || !value) {
      pojo[propertyName] = value;

      return;
    }

    if (shallow) {
      if (association.type === 'collection') {
        return;
      }

      if (value instanceof Entity && value.getId()) {
        pojo[propertyName] = value.getId();

        return;
      }

      if (value instanceof Entity) {
        pojo[propertyName] = value.asObject();

        return;
      }

      if (['string', 'number', 'boolean'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) > -1 || value.constructor === Object) {
        pojo[propertyName] = value;

        return;
      }
    }

    if (!Array.isArray(value)) {
      pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

      return;
    }

    var asObjects = [];

    value.forEach(function (childValue) {
      if ((typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) !== 'object') {
        return;
      }

      if (!(childValue instanceof Entity)) {
        asObjects.push(childValue);

        return;
      }

      if (!shallow || (typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) === 'object' && !childValue.getId()) {
        asObjects.push(childValue.asObject(shallow));
      }
    });

    if (asObjects.length > 0) {
      pojo[propertyName] = asObjects;
    }
  });

  return pojo;
}

function _asJson(entity, shallow) {
  var json = void 0;

  try {
    json = JSON.stringify(_asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

function getCollectionsCompact(forEntity, includeNew) {
  var associations = forEntity.getMeta().fetch('associations');
  var collections = {};

  Object.getOwnPropertyNames(associations).forEach(function (index) {
    var association = associations[index];

    if (association.type !== 'collection') {
      return;
    }

    collections[index] = [];
    if (!Array.isArray(forEntity[index])) {
      return;
    }

    forEntity[index].forEach(function (entity) {
      if (typeof entity === 'number') {
        collections[index].push(entity);

        return;
      }

      if (!(entity instanceof Entity)) {
        return;
      }

      if (entity.getId()) {
        collections[index].push(entity.getId());

        return;
      }

      if (includeNew) {
        collections[index].push(entity);

        return;
      }
    });
  });

  return collections;
}

function getFlat(entity, json) {
  var flat = {
    entity: _asObject(entity, true),
    collections: getCollectionsCompact(entity)
  };

  if (json) {
    flat = JSON.stringify(flat);
  }

  return flat;
}

function getPropertyForAssociation(forEntity, entity) {
  var associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(function (key) {
    return associations[key].entity === entity.getResource();
  })[0];
}