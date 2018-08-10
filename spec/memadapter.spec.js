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

  test('allow permission on resource and verify', async () => {
    await Protektor.allow({
      action: 'read',
      resource: 'Home',
      roleName: 'user1'
    });

    await Protektor.allow({
      action: 'write',
      resource: 'Home',
      roleName: 'user1'
    });

    await Protektor.allow({
      action: 'write',
      resource: 'Home',
      roleName: 'user2'
    });

    await Protektor.allow({
      action: 'read',
      resource: 'Home',
      roleName: 'user2'
    });

    const isAllowed = await Protektor.hasPermission({
      action: 'read',
      resource: 'Home',
      roleName: 'user1'
    });
    expect(isAllowed).toEqual(true);
  });
});
