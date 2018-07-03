import { Roles } from '../src';

describe('Roles', () => {
  it('create allow permissions - new role should be create', () => {
    Roles.allow({ action: 'read', resource: 'view1', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [{ action: 'read', resource: 'view1', isDisallowing: false }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create allow permissions - existing role should be updated', () => {
    Roles.allow({ action: 'read', resource: 'view2', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [
        { action: 'read', resource: 'view1', isDisallowing: false },
        { action: 'read', resource: 'view2', isDisallowing: false }
      ]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create allow permissions - additional role should be created', () => {
    Roles.allow({ action: 'read', resource: 'view3', roleName: 'dev' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev',
      permissions: [{ action: 'read', resource: 'view3', isDisallowing: false }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });
});
