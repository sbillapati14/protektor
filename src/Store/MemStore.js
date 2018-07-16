const {
  RoleNotFoundError,
  PermissionNotFoundError,
  InvalidPayloadTypeError,
  ModelResourceMapNotFoundError
} = require('../Errors');
const { requiredParam } = require('../utils');

module.exports = function createMemstore() {
  const roles = [];
  const modelResourceAccessMap = [];

  function addModelResourceMap(resource, model) {
    modelResourceAccessMap.push({
      resource,
      model
    });
  }

  function removeModelResourceMap(resource, model) {
    const mapIndex = modelResourceAccessMap.findIndex(
      aMap => aMap.resource === resource && aMap.model === model
    );
    if (mapIndex === -1) {
      throw new ModelResourceMapNotFoundError(model, resource);
    }
  }

  function findModelResourceMap(resource, model) {
    return modelResourceAccessMap.find(aMap => aMap.resource === resource && aMap.model === model);
  }

  function addRole(roleName) {
    let role = roles.find(aRole => aRole.name === roleName);
    if (!role) {
      role = {
        name: roleName,
        permissions: []
      };
      roles.push(role);
    }
  }

  function removeRole(roleName) {
    const roleIndex = roles.findIndex(aRole => aRole.name === roleName);
    if (roleIndex === -1) {
      throw new RoleNotFoundError(roleName);
    }

    roles.splice(roleIndex, 1);
  }

  function addPermission(action, resource, isDisallowing, roleName) {
    const role = roles.find(aRole => aRole.name === roleName);
    if (!role) {
      throw new RoleNotFoundError(roleName);
    }

    let permission = role.permissions.find(
      aPermission => aPermission.action === action && aPermission.resource === resource
    );
    if (!permission) {
      permission = {
        action: '',
        resource: '',
        isDisallowing
      };
      role.permissions.push(permission);
    }
    permission.action = action;
    permission.resource = resource;
    permission.isDisallowing = isDisallowing;
  }

  function removePermission(action, resource, roleName) {
    const requestedRole = roles.find(aRole => aRole.name === roleName);
    if (!requestedRole) {
      throw new RoleNotFoundError(roleName);
    }

    const requestedPermissionIndex = requestedRole.permissions.findIndex(
      aPerm => aPerm.action === action && aPerm.resource === resource
    );

    if (requestedPermissionIndex === -1) {
      throw new PermissionNotFoundError(action, resource);
    }

    requestedRole.permissions.splice(requestedPermissionIndex, 1);
  }

  function allRoles() {
    return roles.map(aRole => aRole.name);
  }

  function getRoleByName(roleName) {
    const foundRole = roles.find(aRole => aRole.name === roleName);
    if (!foundRole) {
      throw new RoleNotFoundError(roleName);
    }

    return { ...foundRole };
  }

  function getPermission(action, resource, roleName) {
    const foundRole = getRoleByName(roleName);
    const permission = foundRole.permissions.find(
      aPermission => aPermission.action === action && aPermission.resource === resource
    );
    if (!permission) {
      throw new PermissionNotFoundError(action, resource);
    }
    return permission;
  }

  function toJSON() {
    return {
      roles: [...roles],
      modelResourceAccessMap: [...modelResourceAccessMap]
    };
  }

  function fromJSON({
    rolesData = requiredParam('rolesData'),
    modelResourceAccessMapData = requiredParam('modelResourceAccessMapData')
  }) {
    roles.length = 0;
    modelResourceAccessMap.length = 0;

    // read in roles
    if (!rolesData || !Array.isArray(rolesData)) {
      throw new InvalidPayloadTypeError('Invalid role payload');
    }

    rolesData.forEach((role) => {
      if (!role.name) {
        throw new InvalidPayloadTypeError('Invalid role name');
      }

      if (!role.permissions || !Array.isArray(role.permissions)) {
        throw new InvalidPayloadTypeError(`Invalid permissions type for role: ${role.name}`);
      }

      role.permissions.forEach((perm) => {
        if (
          !perm.action
          || !perm.resource
          || !perm.isDisallowing === undefined
          || !perm.isDisallowing === null
        ) {
          throw new InvalidPayloadTypeError(`Invalid permission payload for role ${role.name}`);
        }

        addRole(role.name);
        addPermission(perm.action, perm.resource, perm.isDisallowing, role.name);
      });
    });

    // read in modelResourceAccessMap
    if (!modelResourceAccessMapData || !Array.isArray(modelResourceAccessMapData)) {
      throw new InvalidPayloadTypeError('Invalid model resource access map payload');
    }

    modelResourceAccessMapData.forEach((aMap) => {
      const addMapping = ({
        resource = requiredParam('resource'),
        model = requiredParam('model')
      }) => ({
        resource,
        model
      });
      modelResourceAccessMap.push(addMapping({ resource: aMap.resource, model: aMap.model }));
    });
  }

  return Object.freeze({
    addModelResourceMap,
    removeModelResourceMap,
    findModelResourceMap,
    addRole,
    removeRole,
    addPermission,
    removePermission,
    allRoles,
    getRoleByName,
    getPermission,
    toJSON,
    fromJSON
  });
};
