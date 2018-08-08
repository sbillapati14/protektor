import {
  curry,
  propEq,
  compose,
  find,
  __,
  append,
  without,
  pathOr,
  where,
  equals,
  map,
  uniq,
  innerJoin,
  flatten,
  contains,
  clone
} from 'ramda';
import { RoleNotFoundError } from '../Errors';

class ProtektorMemAdapter {
  db = {
    resources: [],
    roles: []
  }

  matchResource = propEq('resourceName');

  findResource = compose(
    find(__, this.db.resources),
    this.matchResource,
  );

  pathToModels = pathOr([], ['models'])

  findResourceModels = compose(
    this.pathToModels,
    this.findResource
  );

  removeResourceIfExists = compose(
    without(__, this.db.resources),
    this.objectToArray,
    this.findResource
  );

  matchRole = propEq('roleName');

  findRole = compose(
    find(__, this.db.roles),
    this.matchRole,
  );

  insertPermission = (action, resourceName, roleName, allowed) => {
    const role = this.findRole(roleName);
    if (!role) {
      throw new RoleNotFoundError();
    }

    const objectToArray = curry(obj => obj ? [obj] : []);
    const findPermission = (thisAction, thisResource) => find(where({
      action: equals(thisAction),
      resource: equals(thisResource)
    }));
    const permissions = pathOr([], ['permissions'], role);
    const removePermissionIfExist = compose(
      without(__, permissions),
      objectToArray,
      findPermission(action, resourceName)
    );

    role.permissions = append(
      { action, resourceName, allowed },
      removePermissionIfExist(permissions)
    );
  }

  // Interface methods
  findDataModels = resourceName => this.findResourceModels(resourceName);

  insertDataModels = (resourceName, models) => append(
    { resourceName, models },
    this.removeResourceIfExists(resourceName)
  );

  insertAllow = (action, resourceName, roleName) => this.insertPermission(
    action, resourceName, roleName, true
  );

  insertForbid = (action, resourceName, roleName) => this.insertPermission(
    action, resourceName, roleName, false
  );

  findModel = (modelName, roleName) => {
    const role = this.findRole(roleName);
    if (!role) {
      throw new RoleNotFoundError();
    }

    const permissions = pathOr([], ['permissions'], role);
    const listOfResources = map(pathOr([], ['resource']));
    const uniqueResources = compose(
      uniq,
      listOfResources
    );
    const resourcesOwnedByRole = uniqueResources(permissions);
    const modelsOwnedByResources = innerJoin(
      (resource, resourceName) => resource.resourceName === resourceName,
      this.db.resources
    );
    const modelsOwnedByRole = compose(
      flatten,
      map(pathOr([], ['models'])),
      modelsOwnedByResources
    );

    return contains(modelName, modelsOwnedByRole(resourcesOwnedByRole));
  }

  findAllResourceNames = () => map(pathOr([], ['resourceName']), this.db.resources);

  findAllRoles = () => map(clone, this.db.roles)

  findRole = roleName => find(propEq('roleName', roleName), this.db.roles);
}

export default ProtektorMemAdapter;
