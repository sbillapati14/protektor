import { Roles, createMemstore } from '../src';
import {
  InvalidResourceTypeError,
  RoleNotFoundError,
  PermissionNotFoundError
} from '../src/Errors';

describe('Roles', () => {
  it('create allow permissions - new role should be created', () => {
    Roles.allow({ action: 'read', resource: 'view1', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [{ action: 'read', resource: 'view1', isDisallowing: false }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
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
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create allow permissions - additional role should be created', () => {
    Roles.allow({ action: 'read', resource: 'view3', roleName: 'dev' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev',
      permissions: [{ action: 'read', resource: 'view3', isDisallowing: false }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create allow permission with class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.allow({ action: 'read', resource: SomeObject, roleName: 'dev1' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev1',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: false }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create allow permission with instance of the class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.allow({
      action: 'read',
      resource: new SomeObject(),
      roleName: 'dev2'
    });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev2',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: false }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create allow permission with function type - should add name of function as resource', () => {
    const fn = function goofy() {};
    Roles.allow({ action: 'read', resource: fn, roleName: 'dev3' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev3',
      permissions: [{ action: 'read', resource: 'goofy', isDisallowing: false }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create allow permission with undefined type - should throw Invalid or missing parameter error', () => {
    let wrong;
    expect(() => Roles.allow({ action: 'read', resource: wrong, roleName: 'dev3' })).toThrow(
      'resource'
    );
  });

  it('create forbid permissions - new role should be created', () => {
    Roles.forbid({ action: 'read', resource: 'view1', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [
        { action: 'read', resource: 'view1', isDisallowing: true },
        { action: 'read', resource: 'view2', isDisallowing: false }
      ]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create forbid permissions - existing role should be updated', () => {
    Roles.forbid({ action: 'read', resource: 'view2', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [
        { action: 'read', resource: 'view1', isDisallowing: true },
        { action: 'read', resource: 'view2', isDisallowing: true }
      ]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create forbid permissions - additional role should be created', () => {
    Roles.forbid({ action: 'read', resource: 'view3', roleName: 'dev' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev',
      permissions: [{ action: 'read', resource: 'view3', isDisallowing: true }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create forbid permission with class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.forbid({ action: 'read', resource: SomeObject, roleName: 'dev1' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev1',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create forbid permission with instance of the class type - should add name of class as resource', () => {
    class SomeObject {}
    Roles.forbid({
      action: 'read',
      resource: new SomeObject(),
      roleName: 'dev2'
    });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev2',
      permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create forbid permission with function type - should add name of function as resource', () => {
    const fn = function goofy() {};
    Roles.forbid({ action: 'read', resource: fn, roleName: 'dev3' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'dev3',
      permissions: [{ action: 'read', resource: 'goofy', isDisallowing: true }]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
  });

  it('create forbid permission with undefined type - should throw Invalid or missing parameter error', () => {
    let wrong;
    expect(() => Roles.forbid({ action: 'read', resource: wrong, roleName: 'dev3' })).toThrow(
      'resource'
    );
  });

  it('check root permissions', () => {
    expect(
      Roles.hasPermissions({
        action: 'read',
        resource: 'Posts',
        roleName: 'root'
      })
    ).toBe(true);
  });

  it('check role permissions with multiple permissions - admin should be allowed to read write view 4', () => {
    Roles.allow({ action: 'read', resource: 'view4', roleName: 'admin' });
    Roles.allow({ action: 'write', resource: 'view4', roleName: 'admin' });
    const roleModel = Roles.toJSON();
    const expectedPermission = {
      name: 'admin',
      permissions: [
        { action: 'read', isDisallowing: true, resource: 'view1' },
        { action: 'read', isDisallowing: true, resource: 'view2' },
        { action: 'read', isDisallowing: false, resource: 'view4' },
        { action: 'write', isDisallowing: false, resource: 'view4' }
      ]
    };
    expect(roleModel.roles).toContainEqual(expectedPermission);
    expect(
      Roles.hasPermissions({
        action: 'read',
        resource: 'view4',
        roleName: 'admin'
      })
    ).toBe(true);
    expect(
      Roles.hasPermissions({
        action: 'write',
        resource: 'view4',
        roleName: 'admin'
      })
    ).toBe(true);
    expect(
      Roles.hasPermissions({
        action: 'write',
        resource: 'view2',
        roleName: 'admin'
      })
    ).toBe(false);
    expect(
      Roles.hasPermissions({
        action: 'read',
        resource: 'view2',
        roleName: 'admin'
      })
    ).toBe(false);
  });

  it('check role permissions with single permission - dev3 should not have read access to goofy function', () => {
    expect(
      Roles.hasPermissions({
        action: 'read',
        resource: 'goofy',
        roleName: 'dev3'
      })
    ).toBe(false);
  });

  it('check permissions for reasource without defined permissions - should be denied', () => {
    expect(
      Roles.hasPermissions({
        action: 'modify',
        resource: 'Articles',
        roleName: 'dev3'
      })
    ).toBe(false);
  });

  it('return all role names - should get list of all of the roles', () => {
    const allRoles = Roles.allRoles();
    expect(allRoles).toEqual(['admin', 'dev', 'dev1', 'dev2', 'dev3']);
  });

  it('find specific role - should return role with its permissions', () => {
    const role = Roles.roleByName('admin');
    const expectedRole = {
      name: 'admin',
      permissions: [
        { action: 'read', resource: 'view1', isDisallowing: true },
        { action: 'read', resource: 'view2', isDisallowing: true },
        { action: 'read', resource: 'view4', isDisallowing: false },
        { action: 'write', resource: 'view4', isDisallowing: false }
      ]
    };
    expect(role).toEqual(expectedRole);
  });

  it('load roles from JSON', () => {
    const oldRoles = Roles.toJSON();
    Roles.fromJSON({
      roles: [
        {
          name: 'admin',
          permissions: [
            { action: 'read', resource: 'view1', isDisallowing: true },
            { action: 'read', resource: 'view2', isDisallowing: true },
            { action: 'read', resource: 'view4', isDisallowing: false },
            { action: 'write', resource: 'view4', isDisallowing: false }
          ]
        },
        { name: 'dev', permissions: [{ action: 'read', resource: 'view3', isDisallowing: true }] },
        {
          name: 'dev1',
          permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
        },
        {
          name: 'dev2',
          permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
        },
        { name: 'dev3', permissions: [{ action: 'read', resource: 'goofy', isDisallowing: true }] }
      ],
      modelResourceAccessMap: []
    });
    expect(oldRoles.roles).toEqual(Roles.toJSON().roles);
  });

  it('remove permission - permission should be removed', () => {
    Roles.removePermission({
      action: 'read',
      resource: 'view2',
      roleName: 'admin'
    });
    const role = Roles.roleByName('admin');
    const expectedRole = {
      name: 'admin',
      permissions: [
        { action: 'read', resource: 'view1', isDisallowing: true },
        { action: 'read', resource: 'view4', isDisallowing: false },
        { action: 'write', resource: 'view4', isDisallowing: false }
      ]
    };
    expect(role).toEqual(expectedRole);
  });

  it('remove permission from role that does not exist - should throw error', () => {
    expect(() => Roles.removePermission({
      action: 'read',
      resource: 'view2',
      roleName: 'adminster'
    })).toThrow('Role adminster not found');
  });

  it('remove permission from role that does not have that permission - should thorw error', () => {
    expect(() => Roles.removePermission({
      action: 'modify',
      resource: 'view2',
      roleName: 'admin'
    })).toThrow('Permission action: modify resource: view2 not found');
  });

  it('remove admin role', () => {
    Roles.removeRole('admin');
    const allRoles = Roles.allRoles();
    expect(allRoles).toEqual(['dev', 'dev1', 'dev2', 'dev3']);
  });

  it('remove role that does not exist - should throw error', () => {
    expect(() => Roles.removeRole('notthere')).toThrow('Role notthere not found');
  });

  it('initialize store explictly', () => {
    const memStore = createMemstore();
    const rolesData = [
      {
        name: 'admin',
        permissions: [
          { action: 'read', resource: 'view1', isDisallowing: true },
          { action: 'read', resource: 'view2', isDisallowing: true },
          { action: 'read', resource: 'view4', isDisallowing: false },
          { action: 'write', resource: 'view4', isDisallowing: false }
        ]
      },
      { name: 'dev', permissions: [{ action: 'read', resource: 'view3', isDisallowing: true }] },
      {
        name: 'dev1',
        permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
      },
      {
        name: 'dev2',
        permissions: [{ action: 'read', resource: 'SomeObject', isDisallowing: true }]
      },
      { name: 'dev3', permissions: [{ action: 'read', resource: 'goofy', isDisallowing: true }] }
    ];
    Roles.useStore(memStore);
    Roles.fromJSON({ roles: rolesData, modelResourceAccessMap: [] });
    expect(rolesData).toEqual(Roles.toJSON().roles);
  });

  it('hasPermissions with invalid action', () => {
    expect(() => Roles.hasPermissions('read', '', 'admin')).toThrow(
      'Invalid or missing parameter: action'
    );
  });

  it('hasPermissions with invalid resource', () => {
    expect(() => Roles.hasPermissions({ action: 'read', resource: undefined, roleName: 'admin' })).toThrow('Invalid or missing parameter: resource');
  });

  it('hasPermissions with invalid roleName', () => {
    expect(() => Roles.hasPermissions({ action: 'read', resource: 'view4', role: 'admin' })).toThrow('Invalid or missing parameter: roleName');
  });

  it('test creation fromJSON with invalid data - invalid main top level list', () => {
    expect(() => Roles.fromJSON({})).toThrow('Invalid or missing parameter: rolesData');
  });

  it('test creation fromJSON with invalid data - missing modelResourceAccessMapData', () => {
    expect(() => Roles.fromJSON({ roles: [{}] })).toThrow(
      'Invalid or missing parameter: modelResourceAccessMapData'
    );
  });

  it('test creation fromJSON with invalid data - missing permissions', () => {
    expect(() => Roles.fromJSON({ roles: [{ name: 'admin' }], modelResourceAccessMap: [] })).toThrow('Invalid permissions type for role: admin');
  });

  it('test creation fromJSON with invalid data - invalid permission payload', () => {
    expect(() => Roles.fromJSON({ roles: [{ name: 'admin', permissions: [{}] }], modelResourceAccessMap: [] })).toThrow('Invalid permission payload for role admin');
  });

  it('forbid with invalid action', () => {
    expect(() => Roles.forbid('read', '', 'admin')).toThrow('Invalid or missing parameter: action');
  });

  it('forbid with invalid resource', () => {
    expect(() => Roles.forbid({ action: 'read', resource: undefined, roleName: 'admin' })).toThrow(
      'Invalid or missing parameter: resource'
    );
  });

  it('forbid with invalid roleName', () => {
    expect(() => Roles.forbid({ action: 'read', resource: 'view4', role: 'admin' })).toThrow(
      'Invalid or missing parameter: roleName'
    );
  });

  it('allow with invalid action', () => {
    expect(() => Roles.allow('read', '', 'admin')).toThrow('Invalid or missing parameter: action');
  });

  it('allow with invalid resource', () => {
    expect(() => Roles.allow({ action: 'read', resource: undefined, roleName: 'admin' })).toThrow(
      'Invalid or missing parameter: resource'
    );
  });

  it('allow with invalid roleName', () => {
    expect(() => Roles.allow({ action: 'read', resource: 'view4', role: 'admin' })).toThrow(
      'Invalid or missing parameter: roleName'
    );
  });

  it('removePermission with invalid action', () => {
    expect(() => Roles.removePermission('read', '', 'admin')).toThrow(
      'Invalid or missing parameter: action'
    );
  });

  it('removePermission with invalid resource', () => {
    expect(() => Roles.removePermission({ action: 'read', resource: undefined, roleName: 'admin' })).toThrow('Invalid or missing parameter: resource');
  });

  it('removePermission with invalid roleName', () => {
    expect(() => Roles.removePermission({ action: 'read', resource: 'view4', role: 'admin' })).toThrow('Invalid or missing parameter: roleName');
  });
});
