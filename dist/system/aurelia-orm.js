'use strict';

System.register(['aurelia-logging', './entity-manager', './validator/has-association', 'aurelia-validation', './component/association-select', './component/paged', './repository', './default-repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/validation', './decorator/type', './decorator/validated-resource', './decorator/data'], function (_export, _context) {
  "use strict";

  var getLogger, EntityManager, HasAssociationValidationRule, ValidationGroup, logger;
  return {
    setters: [function (_aureliaLogging) {
      getLogger = _aureliaLogging.getLogger;
    }, function (_entityManager) {
      EntityManager = _entityManager.EntityManager;
    }, function (_validatorHasAssociation) {
      HasAssociationValidationRule = _validatorHasAssociation.HasAssociationValidationRule;
    }, function (_aureliaValidation) {
      ValidationGroup = _aureliaValidation.ValidationGroup;
    }, function (_componentAssociationSelect) {}, function (_componentPaged) {}, function (_repository) {
      var _exportObj = {};
      _exportObj.Repository = _repository.Repository;
      _exportObj.Repository = _repository.Repository;

      _export(_exportObj);
    }, function (_defaultRepository) {
      var _exportObj2 = {};
      _exportObj2.DefaultRepository = _defaultRepository.DefaultRepository;

      _export(_exportObj2);
    }, function (_entity) {
      var _exportObj3 = {};
      _exportObj3.Entity = _entity.Entity;

      _export(_exportObj3);
    }, function (_ormMetadata) {
      var _exportObj4 = {};
      _exportObj4.OrmMetadata = _ormMetadata.OrmMetadata;

      _export(_exportObj4);
    }, function (_decoratorAssociation) {
      var _exportObj5 = {};
      _exportObj5.association = _decoratorAssociation.association;

      _export(_exportObj5);
    }, function (_decoratorResource) {
      var _exportObj6 = {};
      _exportObj6.resource = _decoratorResource.resource;

      _export(_exportObj6);
    }, function (_decoratorEndpoint) {
      var _exportObj7 = {};
      _exportObj7.endpoint = _decoratorEndpoint.endpoint;

      _export(_exportObj7);
    }, function (_decoratorName) {
      var _exportObj8 = {};
      _exportObj8.name = _decoratorName.name;

      _export(_exportObj8);
    }, function (_decoratorRepository) {
      var _exportObj9 = {};
      _exportObj9.repository = _decoratorRepository.repository;

      _export(_exportObj9);
    }, function (_decoratorValidation) {
      var _exportObj10 = {};
      _exportObj10.validation = _decoratorValidation.validation;

      _export(_exportObj10);
    }, function (_decoratorType) {
      var _exportObj11 = {};
      _exportObj11.type = _decoratorType.type;

      _export(_exportObj11);
    }, function (_decoratorValidatedResource) {
      var _exportObj12 = {};
      _exportObj12.validatedResource = _decoratorValidatedResource.validatedResource;

      _export(_exportObj12);
    }, function (_decoratorData) {
      var _exportObj13 = {};
      _exportObj13.data = _decoratorData.data;

      _export(_exportObj13);
    }],
    execute: function () {
      function configure(aurelia, configCallback) {
        var entityManagerInstance = aurelia.container.get(EntityManager);

        configCallback(entityManagerInstance);

        ValidationGroup.prototype.hasAssociation = function () {
          return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
        };

        aurelia.globalResources('./component/association-select');
        aurelia.globalResources('./component/paged');
      }

      _export('configure', configure);

      _export('logger', logger = getLogger('aurelia-orm'));

      _export('EntityManager', EntityManager);

      _export('HasAssociationValidationRule', HasAssociationValidationRule);

      _export('ValidationGroup', ValidationGroup);

      _export('logger', logger);
    }
  };
});