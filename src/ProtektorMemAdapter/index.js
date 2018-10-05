import {
  curry,
  propEq,
  compose,
  find,
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
  isNil,
  equals,
  path,
  prop,
  allPass
} from 'ramda';
import { RoleNotFoundError } from '../Errors';

class ProtektorMemAdapter {
  roleIdentifierComparator;

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

  pathToModels = pathOr([], ['models']);

  findRoleInternal = (roleIdentifier, roles) => find(
    compose(
      equals(this.roleIdentifierComparator(roleIdentifier)),
      this.roleIdentifierComparator,
      path(['roleIdentifier'])
    ), roles
  );

  filterRoleInternal = (filterComparator, roleIdentifier, roles) => filter(
    compose(
      equals(filterComparator(roleIdentifier)),
      filterComparator,
      path(['roleIdentifier'])
    ), roles
  );

  createNewRole = (action, resource, roleIdentifier, allowed) => ({
    roleIdentifier, permissions: [{ action, resource, allowed }]
  });

  insertPermission = (action, resource, roleIdentifier, allowed) => {
    const newRole = this.createNewRole(action, resource, roleIdentifier, allowed);
    const existingRole = curry(roles => find(
      compose(
        equals(this.roleIdentifierComparator(roleIdentifier)),
        this.roleIdentifierComparator,
        path(['roleIdentifier'])
      ), roles
    ));
    const isNewRole = compose(
      isNil,
      existingRole
    );
    const matchPermissions = curry((toRemove, elem) => (elem.action !== toRemove.action || elem.resource !== toRemove.resource));
    const matchRole = curry((toRemove, elem) => elem.roleIdentifier !== toRemove.roleIdentifier);
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
  }

  toJSON = () => clone(this.db);

  // Interface methods
  registerRoleIdentifierComparator = (predicate) => {
    this.roleIdentifierComparator = predicate;
  }

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

  insertAllow = (action, resourceName, roleIdentifier) => this.insertPermission(
    action, resourceName, roleIdentifier, true
  );

  insertForbid = (action, resourceName, roleIdentifier) => this.insertPermission(
    action, resourceName, roleIdentifier, false
  );

  removePermission = (action, resource, roleIdentifier) => {
    const role = this.findRoleInternal(roleIdentifier, this.db.roles);
    if (!role) {
      throw new RoleNotFoundError();
    }

    const rolePermissions = prop('permissions', role);
    const matchActionAndResource = allPass([
      propEq('action', action),
      propEq('resource', resource)
    ]);

    const permissionToRemove = find(matchActionAndResource, rolePermissions);
    const newPermissions = without([permissionToRemove], rolePermissions);
    role.permissions = newPermissions;
    return Promise.resolve();
  }

  removeRole = (roleIdentifier) => {
    const role = this.findRoleInternal(roleIdentifier, this.db.roles);
    if (!role) {
      throw new RoleNotFoundError();
    }

    this.db.roles = without([role], this.db.roles);
    return Promise.resolve();
  }

  hasModel = (modelName, roleIdentifier) => {
    const role = this.findRoleInternal(roleIdentifier, this.db.roles);
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

  findModel = (modelName, roleIdentifier) => {
    const role = this.findRoleInternal(roleIdentifier, this.db.roles);
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

    if (contains(modelName, modelsOwnedByRole(resourcesOwnedByRole))) {
      return Promise.resolve(modelName);
    }

    return Promise.resolve();
  }

  hasPermission = (action, resource, roleIdentifier) => {
    const role = this.findRoleInternal(roleIdentifier, this.db.roles);
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

  filterRoles = (filterComparator, roleIdentifier) => Promise.resolve(
    this.filterRoleInternal(filterComparator, roleIdentifier, this.db.roles)
  );

  findRole = roleIdentifier => Promise.resolve(this.findRoleInternal(roleIdentifier, this.db.roles));
}

export default ProtektorMemAdapter;
