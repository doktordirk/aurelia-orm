'use strict';

System.register(['typer', 'aurelia-dependency-injection', 'aurelia-api', 'aurelia-metadata', 'aurelia-validation', 'aurelia-logging'], function (_export, _context) {
  "use strict";

  var typer, inject, transient, Container, Config, metadata, Validation, ValidationGroup, getLogger, _typeof, _class, _temp, OrmMetadata, Metadata;

  

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

      _export('OrmMetadata', OrmMetadata = function () {
        function OrmMetadata() {
          
        }

        OrmMetadata.forTarget = function forTarget(target) {
          return metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
        };

        return OrmMetadata;
      }());

      _export('OrmMetadata', OrmMetadata);

      _export('Metadata', Metadata = (_temp = _class = function () {
        function Metadata() {
          

          this.metadata = {
            repository: DefaultRepository,
            resource: null,
            endpoint: null,
            name: null,
            idProperty: 'id',
            associations: {}
          };
        }

        Metadata.prototype.addTo = function addTo(key, value) {
          if (typeof this.metadata[key] === 'undefined') {
            this.metadata[key] = [];
          } else if (!Array.isArray(this.metadata[key])) {
            this.metadata[key] = [this.metadata[key]];
          }

          this.metadata[key].push(value);

          return this;
        };

        Metadata.prototype.put = function put(key, valueOrNestedKey, valueOrNull) {
          if (!valueOrNull) {
            this.metadata[key] = valueOrNestedKey;

            return this;
          }

          if (_typeof(this.metadata[key]) !== 'object') {
            this.metadata[key] = {};
          }

          this.metadata[key][valueOrNestedKey] = valueOrNull;

          return this;
        };

        Metadata.prototype.has = function has(key, nested) {
          if (typeof nested === 'undefined') {
            return typeof this.metadata[key] !== 'undefined';
          }

          return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
        };

        Metadata.prototype.fetch = function fetch(key, nested) {
          if (!nested) {
            return this.has(key) ? this.metadata[key] : null;
          }

          if (!this.has(key, nested)) {
            return null;
          }

          return this.metadata[key][nested];
        };

        return Metadata;
      }(), _class.key = 'spoonx:orm:metadata', _temp));

      _export('Metadata', Metadata);
    }
  };
});