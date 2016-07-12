import typer from 'typer';
import { inject, transient, Container } from 'aurelia-dependency-injection';
import { Config } from 'aurelia-api';
import { metadata } from 'aurelia-metadata';
import { Validation, ValidationGroup } from 'aurelia-validation';
import { getLogger } from 'aurelia-logging';

import './component/association-select';
import './component/paged';
export { DefaultRepository } from './default-repository';
export { Repository } from './repository';
export { Entity } from './entity';
export { OrmMetadata } from './orm-metadata';
export { association } from './decorator/association';
export { resource } from './decorator/resource';
export { endpoint } from './decorator/endpoint';
export { name } from './decorator/name';
export { repository } from './decorator/repository';
export { validation } from './decorator/validation';
export { type } from './decorator/type';
export { validatedResource } from './decorator/validated-resource';
export { data } from './decorator/data';

export function configure(aurelia, configCallback) {
  var entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function () {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

var logger = getLogger('aurelia-orm');

export { EntityManager, HasAssociationValidationRule, ValidationGroup, logger };