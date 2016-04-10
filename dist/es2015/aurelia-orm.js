var _dec, _class, _dec2, _class2, _dec3, _dec4, _class4, _class5, _temp, _dec5, _class6;

import typer from 'typer';
import { ValidationGroup, Validation, ValidationRule } from 'aurelia-validation';
import { transient, Container, inject } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { Config } from 'aurelia-api';

import './component/association-select';

function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function () {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
}

export { configure, DefaultRepository, Repository, Entity, OrmMetadata, EntityManager, association, resource, endpoint, name, repository, validation, type, validatedResource };

export let DefaultRepository = (_dec = transient(), _dec(_class = class DefaultRepository extends Repository {}) || _class);

export let EntityManager = (_dec2 = inject(Container), _dec2(_class2 = class EntityManager {
  constructor(container) {
    this.repositories = {};
    this.entities = {};

    this.container = container;
  }

  registerEntities(entities) {
    for (let reference in entities) {
      if (!entities.hasOwnProperty(reference)) {
        continue;
      }

      this.registerEntity(entities[reference]);
    }

    return this;
  }

  registerEntity(entity) {
    this.entities[OrmMetadata.forTarget(entity).fetch('resource')] = entity;

    return this;
  }

  getRepository(entity) {
    let reference = this.resolveEntityReference(entity);
    let resource = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    if (this.repositories[resource]) {
      return this.repositories[resource];
    }

    let metaData = OrmMetadata.forTarget(reference);
    let repository = metaData.fetch('repository');
    let instance = this.container.get(repository);

    if (instance.meta && instance.resource && instance.entityManager) {
      return instance;
    }

    instance.setMeta(metaData);
    instance.resource = resource;
    instance.entityManager = this;

    if (instance instanceof DefaultRepository) {
      this.repositories[resource] = instance;
    }

    return instance;
  }

  resolveEntityReference(resource) {
    let entityReference = resource;

    if (typeof resource === 'string') {
      entityReference = this.entities[resource] || Entity;
    }

    if (typeof entityReference === 'function') {
      return entityReference;
    }

    throw new Error('Unable to resolve to entity reference. Expected string or function.');
  }

  getEntity(entity) {
    let reference = this.resolveEntityReference(entity);
    let instance = this.container.get(reference);
    let resource = reference.getResource();

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  }
}) || _class2);

export let Entity = (_dec3 = transient(), _dec4 = inject(Validation), _dec3(_class4 = _dec4(_class4 = class Entity {
  constructor(validator) {
    this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);

    if (!this.hasValidation()) {
      return this;
    }

    return this.define('__validator', validator);
  }

  getTransport() {
    return this.getRepository().getTransport();
  }

  getRepository() {
    return this.__repository;
  }

  setRepository(repository) {
    return this.define('__repository', repository);
  }

  define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  }

  getMeta() {
    return this.__meta;
  }

  save() {
    if (!this.isNew()) {
      return this.update();
    }

    let response;
    return this.getTransport().create(this.getResource(), this.asObject(true)).then(created => {
      this.id = created.id;
      response = created;
    }).then(() => this.saveCollections()).then(() => this.markClean()).then(() => response);
  }

  update() {
    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    if (this.isClean()) {
      return Promise.resolve(null);
    }

    let requestBody = this.asObject(true);
    let response;

    delete requestBody.id;

    return this.getTransport().update(this.getResource(), this.id, requestBody).then(updated => response = updated).then(() => this.saveCollections()).then(() => this.markClean()).then(() => response);
  }

  addCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let body = undefined;
    let url = [this.getResource(), this.id, property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      body = entity.asObject();
    } else {
      url.push(entity.id);
    }

    return this.getTransport().create(url.join('/'), body).then(created => {
      return entity.setData(created).markClean();
    });
  }

  removeCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.id) {
        return Promise.resolve(null);
      }

      idToRemove = entity.id;
    }

    return this.getTransport().destroy([this.getResource(), this.id, property, idToRemove].join('/'));
  }

  saveCollections() {
    let tasks = [];
    let currentCollections = getCollectionsCompact(this);
    let cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

    let addTasksForDifferences = (base, candidate, method) => {
      if (base === null) {
        return;
      }

      Object.getOwnPropertyNames(base).forEach(property => {
        base[property].forEach(id => {
          if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
            tasks.push(method.call(this, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(results => {
      if (!Array.isArray(results)) {
        return this;
      }

      let newState = null;

      while (newState === null) {
        newState = results.pop();
      }

      if (newState) {
        this.getRepository().getPopulatedEntity(newState, this);
      }

      return this;
    });
  }

  markClean() {
    let cleanValues = getFlat(this);
    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  }

  isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  }

  isDirty() {
    return !this.isClean();
  }

  isNew() {
    return typeof this.id === 'undefined';
  }

  static getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  }

  setResource(resource) {
    return this.define('__resource', resource);
  }

  destroy() {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.id);
  }

  getName() {
    let metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  static getName() {
    let metaName = OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  setData(data) {
    Object.assign(this, data);

    return this;
  }

  enableValidation() {
    if (!this.hasValidation()) {
      throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
    }

    if (this.__validation) {
      return this;
    }

    return this.define('__validation', this.__validator.on(this));
  }

  getValidation() {
    if (!this.hasValidation()) {
      return null;
    }

    if (!this.__validation) {
      this.enableValidation();
    }

    return this.__validation;
  }

  hasValidation() {
    return !!this.getMeta().fetch('validation');
  }

  asObject(shallow) {
    return asObject(this, shallow);
  }

  asJson(shallow) {
    return asJson(this, shallow);
  }
}) || _class4) || _class4);

function asObject(entity, shallow) {
  let pojo = {};
  let metadata = entity.getMeta();

  Object.keys(entity).forEach(propertyName => {
    let value = entity[propertyName];

    if (!metadata.has('associations', propertyName) || !value) {
      pojo[propertyName] = value;

      return;
    }

    if (shallow && typeof value === 'object' && value.id) {
      pojo[propertyName] = value.id;

      return;
    }

    if (!Array.isArray(value)) {
      pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

      return;
    }

    let asObjects = [];

    value.forEach(childValue => {
      if (typeof childValue !== 'object') {
        return;
      }

      if (!(childValue instanceof Entity)) {
        asObjects.push(childValue);

        return;
      }

      if (!shallow || typeof childValue === 'object' && !childValue.id) {
        asObjects.push(childValue.asObject(shallow));
      }
    });

    if (asObjects.length > 0) {
      pojo[propertyName] = asObjects;
    }
  });

  return pojo;
}

function asJson(entity, shallow) {
  let json;

  try {
    json = JSON.stringify(asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

function getCollectionsCompact(forEntity) {
  let associations = forEntity.getMeta().fetch('associations');
  let collections = {};

  Object.getOwnPropertyNames(associations).forEach(index => {
    let association = associations[index];

    if (association.type !== 'collection') {
      return;
    }

    collections[index] = [];

    if (!Array.isArray(forEntity[index])) {
      return;
    }

    forEntity[index].forEach(entity => {
      if (typeof entity === 'number') {
        collections[index].push(entity);

        return;
      }

      if (entity.id) {
        collections[index].push(entity.id);
      }
    });
  });

  return collections;
}

function getFlat(entity, json) {
  let flat = {
    entity: asObject(entity, true),
    collections: getCollectionsCompact(entity)
  };

  if (json) {
    flat = JSON.stringify(flat);
  }

  return flat;
}

function getPropertyForAssociation(forEntity, entity) {
  let associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(key => {
    return associations[key].entity === entity.getResource();
  })[0];
}

export let OrmMetadata = class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target);
  }
};

export let Metadata = (_temp = _class5 = class Metadata {
  constructor() {
    this.metadata = {
      repository: DefaultRepository,
      resource: null,
      endpoint: null,
      name: null,
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
}, _class5.key = 'spoonx:orm:metadata', _temp);

export let Repository = (_dec5 = inject(Config), _dec5(_class6 = class Repository {
  constructor(clientConfig) {
    this.transport = null;

    this.clientConfig = clientConfig;
  }

  getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

      if (!this.transport) {
        throw new Error(`No transport found for '${ this.getMeta().fetch('endpoint') || 'default' }'.`);
      }
    }

    return this.transport;
  }

  setMeta(meta) {
    this.meta = meta;
  }

  getMeta() {
    return this.meta;
  }

  setResource(resource) {
    this.resource = resource;

    return this;
  }

  getResource() {
    return this.resource;
  }

  find(criteria, raw) {
    return this.findPath(this.resource, criteria, raw);
  }

  findPath(path, criteria, raw) {
    let findQuery = this.getTransport().find(path, criteria);

    if (raw) {
      return findQuery;
    }

    return findQuery.then(x => this.populateEntities(x)).then(populated => {
      if (!Array.isArray(populated)) {
        return populated.markClean();
      }

      populated.forEach(entity => entity.markClean());

      return populated;
    });
  }

  count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  }

  populateEntities(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      return this.getPopulatedEntity(data);
    }

    let collection = [];

    data.forEach(source => {
      collection.push(this.getPopulatedEntity(source));
    });

    return collection;
  }

  getPopulatedEntity(data, entity) {
    entity = entity || this.getNewEntity();
    let entityMetadata = entity.getMeta();
    let populatedData = {};
    let key;

    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      let value = data[key];

      if (entityMetadata.has('types', key)) {
        populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

        continue;
      }

      if (!entityMetadata.has('associations', key) || typeof value !== 'object') {
        populatedData[key] = value;

        continue;
      }

      let repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);
      populatedData[key] = repository.populateEntities(value);
    }

    return entity.setData(populatedData);
  }

  getNewEntity() {
    return this.entityManager.getEntity(this.resource);
  }

  getNewPopulatedEntity() {
    let entity = this.getNewEntity();
    let associations = entity.getMeta().fetch('associations');

    for (let property in associations) {
      let assocMeta = associations[property];

      if (assocMeta.type !== 'entity') {
        continue;
      }

      entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
    }

    return entity;
  }
}) || _class6);

export function association(associationData) {
  return function (target, propertyName) {
    if (!associationData) {
      associationData = { entity: propertyName };
    } else if (typeof associationData === 'string') {
      associationData = { entity: associationData };
    }

    OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
      type: associationData.entity ? 'entity' : 'collection',
      entity: associationData.entity || associationData.collection
    });
  };
}

export function endpoint(entityEndpoint) {
  return function (target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}

export function name(entityName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

export function repository(repositoryReference) {
  return function (target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

export function resource(resourceName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

export function type(typeValue) {
  return function (target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}

export function validatedResource(resourceName) {
  return function (target, propertyName) {
    resource(resourceName)(target);
    validation()(target, propertyName);
  };
}

export function validation() {
  return function (target) {
    OrmMetadata.forTarget(target).put('validation', true);
  };
}

export let HasAssociationValidationRule = class HasAssociationValidationRule extends ValidationRule {
  constructor() {
    super(null, value => !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number'), null, 'isRequired');
  }
};