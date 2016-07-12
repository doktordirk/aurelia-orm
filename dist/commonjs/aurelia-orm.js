'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.ValidationGroup = exports.HasAssociationValidationRule = exports.EntityManager = exports.data = exports.validatedResource = exports.type = exports.validation = exports.repository = exports.name = exports.endpoint = exports.resource = exports.association = exports.OrmMetadata = exports.Entity = exports.Repository = exports.DefaultRepository = undefined;

var _defaultRepository = require('./default-repository');

Object.defineProperty(exports, 'DefaultRepository', {
  enumerable: true,
  get: function get() {
    return _defaultRepository.DefaultRepository;
  }
});

var _repository = require('./repository');

Object.defineProperty(exports, 'Repository', {
  enumerable: true,
  get: function get() {
    return _repository.Repository;
  }
});

var _entity = require('./entity');

Object.defineProperty(exports, 'Entity', {
  enumerable: true,
  get: function get() {
    return _entity.Entity;
  }
});

var _ormMetadata = require('./orm-metadata');

Object.defineProperty(exports, 'OrmMetadata', {
  enumerable: true,
  get: function get() {
    return _ormMetadata.OrmMetadata;
  }
});

var _association = require('./decorator/association');

Object.defineProperty(exports, 'association', {
  enumerable: true,
  get: function get() {
    return _association.association;
  }
});

var _resource = require('./decorator/resource');

Object.defineProperty(exports, 'resource', {
  enumerable: true,
  get: function get() {
    return _resource.resource;
  }
});

var _endpoint = require('./decorator/endpoint');

Object.defineProperty(exports, 'endpoint', {
  enumerable: true,
  get: function get() {
    return _endpoint.endpoint;
  }
});

var _name = require('./decorator/name');

Object.defineProperty(exports, 'name', {
  enumerable: true,
  get: function get() {
    return _name.name;
  }
});

var _repository2 = require('./decorator/repository');

Object.defineProperty(exports, 'repository', {
  enumerable: true,
  get: function get() {
    return _repository2.repository;
  }
});

var _validation = require('./decorator/validation');

Object.defineProperty(exports, 'validation', {
  enumerable: true,
  get: function get() {
    return _validation.validation;
  }
});

var _type = require('./decorator/type');

Object.defineProperty(exports, 'type', {
  enumerable: true,
  get: function get() {
    return _type.type;
  }
});

var _validatedResource = require('./decorator/validated-resource');

Object.defineProperty(exports, 'validatedResource', {
  enumerable: true,
  get: function get() {
    return _validatedResource.validatedResource;
  }
});

var _data = require('./decorator/data');

Object.defineProperty(exports, 'data', {
  enumerable: true,
  get: function get() {
    return _data.data;
  }
});
exports.configure = configure;

var _typer = require('typer');

var _typer2 = _interopRequireDefault(_typer);

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaApi = require('aurelia-api');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaValidation = require('aurelia-validation');

var _aureliaLogging = require('aurelia-logging');

require('./component/association-select');

require('./component/paged');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(aurelia, configCallback) {
  var entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  _aureliaValidation.ValidationGroup.prototype.hasAssociation = function () {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

var logger = (0, _aureliaLogging.getLogger)('aurelia-orm');

exports.EntityManager = EntityManager;
exports.HasAssociationValidationRule = HasAssociationValidationRule;
exports.ValidationGroup = _aureliaValidation.ValidationGroup;
exports.logger = logger;