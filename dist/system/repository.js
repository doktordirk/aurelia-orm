'use strict';

System.register(['typer', 'aurelia-dependency-injection', 'aurelia-api', 'aurelia-metadata', 'aurelia-validation', 'aurelia-logging'], function (_export, _context) {
  "use strict";

  var typer, inject, transient, Container, Config, metadata, Validation, ValidationGroup, getLogger, _typeof, _dec, _class, Repository;

  

  return {
    setters: [function (_typer) {
      typer = _typer.default;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      transient = _aureliaDependencyInjection.transient;
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaApi) {
      Config = _aureliaApi.Config;
    }, function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_aureliaValidation) {
      Validation = _aureliaValidation.Validation;
      ValidationGroup = _aureliaValidation.ValidationGroup;
    }, function (_aureliaLogging) {
      getLogger = _aureliaLogging.getLogger;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('Repository', Repository = (_dec = inject(Config), _dec(_class = function () {
        function Repository(clientConfig) {
          

          this.transport = null;

          this.clientConfig = clientConfig;
        }

        Repository.prototype.getTransport = function getTransport() {
          if (this.transport === null) {
            this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

            if (!this.transport) {
              throw new Error('No transport found for \'' + (this.getMeta().fetch('endpoint') || 'default') + '\'.');
            }
          }

          return this.transport;
        };

        Repository.prototype.setMeta = function setMeta(meta) {
          this.meta = meta;
        };

        Repository.prototype.getMeta = function getMeta() {
          return this.meta;
        };

        Repository.prototype.setResource = function setResource(resource) {
          this.resource = resource;

          return this;
        };

        Repository.prototype.getResource = function getResource() {
          return this.resource;
        };

        Repository.prototype.find = function find(criteria, raw) {
          return this.findPath(this.resource, criteria, raw);
        };

        Repository.prototype.findPath = function findPath(path, criteria, raw) {
          var _this = this;

          var findQuery = this.getTransport().find(path, criteria);

          if (raw) {
            return findQuery;
          }

          return findQuery.then(function (x) {
            return _this.populateEntities(x);
          }).then(function (populated) {
            if (!Array.isArray(populated)) {
              return populated.markClean();
            }

            populated.forEach(function (entity) {
              return entity.markClean();
            });

            return populated;
          });
        };

        Repository.prototype.count = function count(criteria) {
          return this.getTransport().find(this.resource + '/count', criteria);
        };

        Repository.prototype.populateEntities = function populateEntities(data) {
          var _this2 = this;

          if (!data) {
            return null;
          }

          if (!Array.isArray(data)) {
            return this.getPopulatedEntity(data);
          }

          var collection = [];

          data.forEach(function (source) {
            collection.push(_this2.getPopulatedEntity(source));
          });

          return collection;
        };

        Repository.prototype.getPopulatedEntity = function getPopulatedEntity(data, entity) {
          entity = entity || this.getNewEntity();
          var entityMetadata = entity.getMeta();
          var populatedData = {};
          var key = void 0;

          for (key in data) {
            if (!data.hasOwnProperty(key)) {
              continue;
            }

            var value = data[key];

            if (entityMetadata.has('types', key)) {
              populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

              continue;
            }

            if (!entityMetadata.has('associations', key) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
              populatedData[key] = value;

              continue;
            }

            var repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);
            populatedData[key] = repository.populateEntities(value);
          }

          return entity.setData(populatedData);
        };

        Repository.prototype.getNewEntity = function getNewEntity() {
          return this.entityManager.getEntity(this.resource);
        };

        Repository.prototype.getNewPopulatedEntity = function getNewPopulatedEntity() {
          var entity = this.getNewEntity();
          var associations = entity.getMeta().fetch('associations');

          for (var property in associations) {
            var assocMeta = associations[property];

            if (assocMeta.type !== 'entity') {
              continue;
            }

            entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
          }

          return entity;
        };

        return Repository;
      }()) || _class));

      _export('Repository', Repository);
    }
  };
});