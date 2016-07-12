import typer from 'typer';
import {inject,transient,Container} from 'aurelia-dependency-injection';
import {Config} from 'aurelia-api';
import {metadata} from 'aurelia-metadata';
import {Validation,ValidationGroup} from 'aurelia-validation';
import {getLogger} from 'aurelia-logging';

/**
 * The DefaultRepository class
 * @transient
 */
@transient()
export class DefaultRepository extends Repository {
}
