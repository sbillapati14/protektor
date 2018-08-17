import { createRole } from '../src/index';

describe('Tests of Role object', () => {
  test('create simple role and check if access is allowed', () => {
    const roleJSON = {
      roleIdentifier: {
        name: 'testrole'
      },
      permissions: [
        {
          action: 'read',
          resource: 'Home',
          allowed: true
        }
      ]
    };
    const role = createRole(roleJSON);
    const isAllowed = role.hasPermission({ action: 'read', resource: 'Home' });
    expect(isAllowed).toEqual(true);
  });

  test('create empty and check if access is allowed', () => {
    const role = createRole();
    const isAllowed = role.hasPermission({ action: 'read', resource: 'Home' });
    expect(isAllowed).toEqual(false);
  });

  test('create role by passing invalid permission key in JSON', () => {
    const roleJSON = {
      roleIdentifier: {
        name: 'testrole'
      },
      permissio: [
        {
          action: 'read',
          resource: 'Home',
          allowed: true
        }
      ]
    };
    expect(() => createRole(roleJSON)).toThrow('Invalid payload type');
  });

  test('create role by passing permission key as object instead of array', () => {
    const roleJSON = {
      roleIdentifier: {
        name: 'testrole'
      },
      permission: {
        action: 'read',
        resource: 'Home',
        allowed: true
      }
    };
    expect(() => createRole(roleJSON)).toThrow('Invalid payload type');
  });

  test('create role by passing invalid roleIdentifier key in JSON', () => {
    const roleJSON = {
      rolesIdentifier: {
        name: 'testrole'
      },
      permissio: [
        {
          action: 'read',
          resource: 'Home',
          allowed: true
        }
      ]
    };
    expect(() => createRole(roleJSON)).toThrow('Invalid payload type');
  });
});
