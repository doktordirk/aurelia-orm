'use strict';

System.register(['aurelia-dependency-injection', './repository'], function (_export, _context) {
  "use strict";

  var transient, Repository, _dec, _class, DefaultRepository;

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      transient = _aureliaDependencyInjection.transient;
    }, function (_repository) {
      Repository = _repository.Repository;
    }],
    execute: function () {
      _export('DefaultRepository', DefaultRepository = (_dec = transient(), _dec(_class = function (_Repository) {
        _inherits(DefaultRepository, _Repository);

        function DefaultRepository() {
          

          return _possibleConstructorReturn(this, _Repository.apply(this, arguments));
        }

        return DefaultRepository;
      }(Repository)) || _class));

      _export('DefaultRepository', DefaultRepository);
    }
  };
});