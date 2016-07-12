define(['exports', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/validation', './decorator/type', './decorator/validated-resource', './decorator/data', 'typer', 'aurelia-dependency-injection', 'aurelia-api', 'aurelia-metadata', 'aurelia-validation', 'aurelia-logging', './component/association-select', './component/paged'], function (exports, _defaultRepository, _repository, _entity, _ormMetadata, _association, _resource, _endpoint, _name, _repository2, _validation, _type, _validatedResource, _data, _typer, _aureliaDependencyInjection, _aureliaApi, _aureliaMetadata, _aureliaValidation, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.logger = exports.ValidationGroup = exports.HasAssociationValidationRule = exports.EntityManager = exports.data = exports.validatedResource = exports.type = exports.validation = exports.repository = exports.name = exports.endpoint = exports.resource = exports.association = exports.OrmMetadata = exports.Entity = exports.Repository = exports.DefaultRepository = undefined;
  Object.defineProperty(exports, 'DefaultRepository', {
    enumerable: true,
    get: function () {
      return _defaultRepository.DefaultRepository;
    }
  });
  Object.defineProperty(exports, 'Repository', {
    enumerable: true,
    get: function () {
      return _repository.Repository;
    }
  });
  Object.defineProperty(exports, 'Entity', {
    enumerable: true,
    get: function () {
      return _entity.Entity;
    }
  });
  Object.defineProperty(exports, 'OrmMetadata', {
    enumerable: true,
    get: function () {
      return _ormMetadata.OrmMetadata;
    }
  });
  Object.defineProperty(exports, 'association', {
    enumerable: true,
    get: function () {
      return _association.association;
    }
  });
  Object.defineProperty(exports, 'resource', {
    enumerable: true,
    get: function () {
      return _resource.resource;
    }
  });
  Object.defineProperty(exports, 'endpoint', {
    enumerable: true,
    get: function () {
      return _endpoint.endpoint;
    }
  });
  Object.defineProperty(exports, 'name', {
    enumerable: true,
    get: function () {
      return _name.name;
    }
  });
  Object.defineProperty(exports, 'repository', {
    enumerable: true,
    get: function () {
      return _repository2.repository;
    }
  });
  Object.defineProperty(exports, 'validation', {
    enumerable: true,
    get: function () {
      return _validation.validation;
    }
  });
  Object.defineProperty(exports, 'type', {
    enumerable: true,
    get: function () {
      return _type.type;
    }
  });
  Object.defineProperty(exports, 'validatedResource', {
    enumerable: true,
    get: function () {
      return _validatedResource.validatedResource;
    }
  });
  Object.defineProperty(exports, 'data', {
    enumerable: true,
    get: function () {
      return _data.data;
    }
  });
  exports.configure = configure;

  var _typer2 = _interopRequireDefault(_typer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
});