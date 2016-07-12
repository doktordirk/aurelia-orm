define(['exports', 'typer', 'aurelia-dependency-injection', 'aurelia-api', 'aurelia-metadata', 'aurelia-validation', 'aurelia-logging'], function (exports, _typer, _aureliaDependencyInjection, _aureliaApi, _aureliaMetadata, _aureliaValidation, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DefaultRepository = undefined;

  var _typer2 = _interopRequireDefault(_typer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  

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

  var _dec, _class;

  var DefaultRepository = exports.DefaultRepository = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function (_Repository) {
    _inherits(DefaultRepository, _Repository);

    function DefaultRepository() {
      

      return _possibleConstructorReturn(this, _Repository.apply(this, arguments));
    }

    return DefaultRepository;
  }(Repository)) || _class);
});