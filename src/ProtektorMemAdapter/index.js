import {
  curry,
  propEq,
  compose,
  find,
  findIndex,
  __,
  append,
  without,
  pathOr,
  map,
  uniq,
  innerJoin,
  flatten,
  contains,
  clone,
  ifElse,
  set,
  filter,
  head,
  lensProp,
  isNil
} from 'ramda';
import { RoleNotFoundError } from '../Errors';

class ProtektorMemAdapter {
  db = {
    resources: [],
    roles: []
  };

  objectToArray = curry(obj => obj ? [obj] : []);

  matchResource = propEq('resourceName');

  findResource = curry(resources => compose(
    find(__, resources),
    this.matchResource,
  ));

  pathToModels = pathOr([], ['models'])

  matchRole = propEq('roleName');

  findRole = (roleName, roles) => find(propEq('roleName', roleName), roles);

  findRoleIdx = (roleName, roles) => findIndex(propEq('roleName', roleName), roles);

  createNewRole = (action, resource, roleName, allowed) => ({
    roleName, permissions: [{ action, resource, allowed }]
  });

  insertPermission = (action, resource, roleName, allowed) => {
    const newRole = this.createNewRole(action, resource, roleName, allowed);
    const existingRole = curry(roles => find(propEq('roleName', roleName), roles));
    const isNewRole = compose(
      isNil,
      existingRole
    );
    const matchPermissions = curry((toRemove, elem) => (elem.action !== toRemove.action || elem.resource !== toRemove.resource));
    const matchRole = curry((toRemove, elem) => elem.roleName !== toRemove.roleName);
    const removeDup = (matcher, toRemove) => filter(matcher(toRemove));
    const mergeObjectToList = (matcher, newObj, list) => compose(
      append(newObj),
      removeDup(matcher, newObj),
    )(list);
    const updateExistingRole = curry((roleToAdd, roles) => {
      const roleToUpdate = existingRole(roles);
      const newPermissions = mergeObjectToList(matchPermissions, head(roleToAdd.permissions), roleToUpdate.permissions);
      const updatedRole = set(
        lensProp('permissions'),
        newPermissions,
        roleToUpdate
      );
      const mergedRoles = mergeObjectToList(matchRole, updatedRole, roles);
      return mergedRoles;
    });
    const updateRole = ifElse(
      isNewRole,
      append(newRole),
      updateExistingRole(newRole)
    );
    const updatedRoles = updateRole(this.db.roles);
    this.db.roles = updatedRoles;
    console.log('db:', JSON.stringify(this.db));
  }

  toJSON = () => clone(this.db);

  // Interface methods
  findDataModels = (resource) => {
    const findResourceModels = compose(
      this.pathToModels,
      this.findResource(this.db.resources)
    );

    return Promise.resolve(findResourceModels(resource));
  }

  insertDataModels = (resource, models) => {
    const removeResourceIfExists = compose(
      without(__, this.db.resources),
      this.objectToArray,
      this.findResource(this.db.resources)
    );
    const updatedResources = append(
      { resourceName: resource, models },
      removeResourceIfExists(resource)
    );
    this.db.resources = updatedResources;
    return Promise.resolve();
  }

  insertAllow = (action, resourceName, roleName) => this.insertPermission(
    action, resourceName, roleName, true
  );

  insertForbid = (action, resourceName, roleName) => this.insertPermission(
    action, resourceName, roleName, false
  );

  findModel = (modelName, roleName) => {
    const role = this.findRole(roleName, this.db.roles);
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

    return Promise.resolve(contains(modelName, modelsOwnedByRole(resourcesOwnedByRole)));
  }

  hasPermission = (action, resource, roleName) => {
    const role = this.findRole(roleName, this.db.roles);
    if (!role) {
      throw new RoleNotFoundError();
    }
    const permissions = pathOr([], ['permissions']);
    const isAllowed = compose(
      contains({ action, resource, allowed: true }),
      permissions
    );
    return Promise.resolve(isAllowed(role));
  }

  findAllResourceNames = () => Promise.resolve(map(pathOr([], ['resourceName']), this.db.resources));

  findAllRoles = () => Promise.resolve(map(clone, this.db.roles));

  findRole = roleName => Promise.resolve(find(propEq('roleName', roleName), this.db.roles));
}

export default ProtektorMemAdapter;
