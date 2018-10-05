import ProtektorMemAdapter from '../src/ProtektorMemAdapter';
import Protektor from '../src/Protektor';

const adapter = new ProtektorMemAdapter();
Protektor.registerAdapter(adapter);

describe('Protektor with mem adapter', () => {
  test('insert data models', async () => {
    await Protektor.resourceModels('Home', ['home']);
    const db = adapter.toJSON();
    expect(db.resources).toContainEqual({ resourceName: 'Home', models: ['home'] });
  });

  test('retrieve data models', async () => {
    const models = await Protektor.resourceModels('Home');
    expect(models).toEqual(['home']);
  });

  test('insert additional data model', async () => {
    await Protektor.resourceModels('Reports', ['reports']);
    const db = adapter.toJSON();
    expect(db.resources).toContainEqual({ resourceName: 'Home', models: ['home'] });
    expect(db.resources).toContainEqual({ resourceName: 'Reports', models: ['reports'] });
  });

  test('verify data models for both resources can be retrieved', async () => {
    const homeModels = await Protektor.resourceModels('Home');
    const reportsModels = await Protektor.resourceModels('Reports');
    expect(homeModels).toEqual(['home']);
    expect(reportsModels).toEqual(['reports']);
  });

  test('update data models of existing resource', async () => {
    await Protektor.resourceModels('Home', ['home', 'home2']);
    const homeModels = await Protektor.resourceModels('Home');
    expect(homeModels).toEqual(['home', 'home2']);
  });

  test('allow permission for first role', async () => {
    await Protektor.allow({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });

    const isAllowed = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    expect(isAllowed).toEqual(true);
  });

  test('add permission for second role', async () => {
    await Protektor.allow({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
  });

  test('add second permission for first role', async () => {
    await Protektor.allow({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
    expect(isAllowedRole11).toEqual(true);
  });

  test('add second permission for second role', async () => {
    await Protektor.allow({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isAllowedRole22 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
    expect(isAllowedRole11).toEqual(true);
    expect(isAllowedRole22).toEqual(true);
  });

  test('forbid permission for first role', async () => {
    await Protektor.forbid({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isAllowedRole22 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isForbidden1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });

    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
    expect(isAllowedRole11).toEqual(true);
    expect(isAllowedRole22).toEqual(true);
    expect(isForbidden1).toEqual(false);
  });

  test('forbid permission for second role', async () => {
    await Protektor.forbid({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isAllowedRole22 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isForbidden1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isForbidden2 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2'
      }
    });

    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
    expect(isAllowedRole11).toEqual(true);
    expect(isAllowedRole22).toEqual(true);
    expect(isForbidden1).toEqual(false);
    expect(isForbidden2).toEqual(false);
  });

  test('forbid second permission for first role', async () => {
    await Protektor.forbid({
      action: 'write',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isAllowedRole22 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isForbidden1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isForbidden2 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isForbidden11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });

    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
    expect(isAllowedRole11).toEqual(true);
    expect(isAllowedRole22).toEqual(true);
    expect(isForbidden1).toEqual(false);
    expect(isForbidden2).toEqual(false);
    expect(isForbidden11).toEqual(false);
  });

  test('forbid second permission for second role', async () => {
    await Protektor.forbid({
      action: 'write',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2'
      }
    });

    const isAllowedRole1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isAllowedRole2 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isAllowedRole22 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isForbidden1 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isForbidden2 = await Protektor.hasPermission({
      action: 'read',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2'
      }
    });
    const isForbidden11 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1'
      }
    });
    const isForbidden22 = await Protektor.hasPermission({
      action: 'write',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2'
      }
    });

    expect(isAllowedRole1).toEqual(true);
    expect(isAllowedRole2).toEqual(true);
    expect(isAllowedRole11).toEqual(true);
    expect(isAllowedRole22).toEqual(true);
    expect(isForbidden1).toEqual(false);
    expect(isForbidden2).toEqual(false);
    expect(isForbidden11).toEqual(false);
    expect(isForbidden22).toEqual(false);
  });

  test('get all resource names', async () => {
    const allResourceNames = await Protektor.allResourceNames();
    expect(allResourceNames).toEqual(['Reports', 'Home']);
  });

  test('allow permission for first role with group', async () => {
    await Protektor.allow({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });

    const isAllowedGlobal = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    expect(isAllowedGlobal).toEqual(true);
  });

  test('verify that role without the group cannot access resource', async () => {
    const isAllowed = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1'
      }
    });
    expect(isAllowed).toEqual(false);
  });

  test('allow permission for second role with group', async () => {
    await Protektor.allow({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role2',
        group: 'global'
      }
    });

    const isAllowedGlobal1 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    const isAllowedGlobal2 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    expect(isAllowedGlobal1).toEqual(true);
    expect(isAllowedGlobal2).toEqual(true);
  });

  test('allow second permission for first role with group', async () => {
    await Protektor.allow({
      action: 'update',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });

    const isAllowedGlobal1 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    const isAllowedGlobal2 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    const isAllowedGlobal11 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    expect(isAllowedGlobal1).toEqual(true);
    expect(isAllowedGlobal2).toEqual(true);
    expect(isAllowedGlobal11).toEqual(true);
  });

  test('allow second permission for second role with group', async () => {
    await Protektor.allow({
      action: 'update',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role2',
        group: 'global'
      }
    });

    const isAllowedGlobal1 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    const isAllowedGlobal2 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Home',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    const isAllowedGlobal11 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    const isAllowedGlobal21 = await Protektor.hasPermission({
      action: 'update',
      resource: 'Reports',
      roleIdentifier: {
        name: 'role1',
        group: 'global'
      }
    });
    expect(isAllowedGlobal1).toEqual(true);
    expect(isAllowedGlobal2).toEqual(true);
    expect(isAllowedGlobal11).toEqual(true);
    expect(isAllowedGlobal21).toEqual(true);
  });

  test('filter all roles with global group', async () => {
    const globalRoles = await Protektor.filterRoles(
      roleIdentifier => roleIdentifier.group,
      {
        group: 'global'
      }
    );

    expect(globalRoles).toEqual(
      [
        {
          roleIdentifier:
            { name: 'role1', group: 'global' },
          permissions: [
            { action: 'update', resource: 'Home', allowed: true },
            { action: 'update', resource: 'Reports', allowed: true }
          ]
        },
        {
          roleIdentifier: { name: 'role2', group: 'global' },
          permissions: [
            { action: 'update', resource: 'Home', allowed: true },
            { action: 'update', resource: 'Reports', allowed: true }
          ]
        }
      ]
    );
  });

  test('find role based on the name', async () => {
    const role = await Protektor.roleToJSON({ name: 'role2' });

    expect(role).toEqual(
      {
        roleIdentifier: { name: 'role2' },
        permissions:
          [
            { action: 'write', resource: 'Home', allowed: true },
            { action: 'read', resource: 'Home', allowed: true },
            { action: 'read', resource: 'Reports', allowed: false },
            { action: 'write', resource: 'Reports', allowed: false }
          ]
      }
    );
  });

  test('remove permission from role', async () => {
    await Protektor.removePermission({ action: 'read', resource: 'Reports', roleIdentifier: { name: 'role2' } });
    const role = await Protektor.roleToJSON({ name: 'role2' });

    expect(role).toEqual(
      {
        roleIdentifier: { name: 'role2' },
        permissions:
          [
            { action: 'write', resource: 'Home', allowed: true },
            { action: 'read', resource: 'Home', allowed: true },
            { action: 'write', resource: 'Reports', allowed: false }
          ]
      }
    );
  });
});
