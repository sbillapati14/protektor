import { Roles } from '../src';
import { InvalidResourceTypeError } from '../src/Errors';

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

  it('create allow permission with class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.allow({ action: 'read', resource: SomeObject, roleName: 'dev1' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev1',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: false }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create allow permission with instance of the class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.allow({ action: 'read', resource: new SomeObject(), roleName: 'dev2' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev2',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: false }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create allow permission with function type - should add name of function as resource', () => {
    const fn = function goofy() {};
    Roles.allow({ action: 'read', resource: fn, roleName: 'dev3' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev3',
      permissions: [{ action: 'read', resource: 'goofy', isDisallowing: false }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create allow permission with undefined type - should throw Invalid or missing parameter error', () => {
    let wrong;
    expect(() => Roles.allow({ action: 'read', resource: wrong, roleName: 'dev3' })).toThrow(
      'resource'
    );
  });

  it('create forbid permissions - new role should be create', () => {
    Roles.allow({ action: 'read', resource: 'view1', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [{ action: 'read', resource: 'view1', isDisallowing: true }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create forbid permissions - existing role should be updated', () => {
    Roles.allow({ action: 'read', resource: 'view2', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [
        { action: 'read', resource: 'view1', isDisallowing: true },
        { action: 'read', resource: 'view2', isDisallowing: true }
      ]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create forbid permissions - additional role should be created', () => {
    Roles.allow({ action: 'read', resource: 'view3', roleName: 'dev' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev',
      permissions: [{ action: 'read', resource: 'view3', isDisallowing: true }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create forbid permission with class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.allow({ action: 'read', resource: SomeObject, roleName: 'dev1' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev1',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create forbid permission with instance of the class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.allow({ action: 'read', resource: new SomeObject(), roleName: 'dev2' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev2',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create forbid permission with function type - should add name of function as resource', () => {
    const fn = function goofy() {};
    Roles.allow({ action: 'read', resource: fn, roleName: 'dev3' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev3',
      permissions: [{ action: 'read', resource: 'goofy', isDisallowing: true }]
    };
    expect(roleModel).toContainEqual(expectedPermission);
  });

  it('create forbid permission with undefined type - should throw Invalid or missing parameter error', () => {
    let wrong;
    expect(() => Roles.allow({ action: 'read', resource: wrong, roleName: 'dev3' })).toThrow(
      'resource'
    );
  });
});
