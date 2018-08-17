import { RoleBuilder } from '../src';

describe('RoleBuilder tests', () => {
  test('create role from JSON', () => {
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
    const role = RoleBuilder.fromJSON(roleJSON);
    const isAllowed = role.hasPermission({ action: 'read', resource: 'Home' });
    expect(isAllowed).toEqual(true);
  });

  test('create empty role via fromJSON', () => {
    const role = RoleBuilder.fromJSON();
    const isAllowed = role.hasPermission({ action: 'read', resource: 'Home' });
    expect(isAllowed).toEqual(false);
  });

  test('create empty role via emptyRole', () => {
    const role = RoleBuilder.fromJSON();
    const isAllowed = role.hasPermission({ action: 'read', resource: 'Home' });
    expect(isAllowed).toEqual(false);
  });
});
