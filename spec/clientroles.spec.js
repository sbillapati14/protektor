import { Role, Permission } from '../src/ClientRole';

describe('ClientRole', () => {
  it('create new role to allow', () => {
    const permissions = [];
    permissions.push(Permission().allow({ action: 'read', resource: 'Home' }));
    const role = Role().createRole({ name: 'admin', permissions });
    expect(role.hasPermission({ action: 'read', resource: 'Home' })).toBeTruthy();
  });

  it('create new role to forbid', () => {
    const permissions = [];
    permissions.push(Permission().forbid({ action: 'read', resource: 'Home' }));
    const role = Role().createRole({ name: 'admin', permissions });
    expect(role.hasPermission({ action: 'read', resource: 'Home' })).toBeFalsy();
  });

  it('create new role to allow fromJSON', () => {
    const data = {
      name: 'admin',
      permissions: [{ action: 'read', resource: 'Home' }]
    };
    const role = Role().fromJSON(data);
    expect(role.hasPermission({ action: 'read', resource: 'Home' })).toBeTruthy();
  });
});
