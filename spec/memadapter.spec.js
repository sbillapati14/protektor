import ProtektorMemAdapter from '../src/ProtektorMemAdapter';
import Protektor from '../src/Protektor';

const adapter = new ProtektorMemAdapter();
Protektor.registerAdapter(adapter);

describe('Protektor with mem adapter', () => {
  test('insert data models', async () => {
    await Protektor.resource('Home', ['home']);
    const db = adapter.toJSON();
    expect(db.resources).toContainEqual({ resourceName: 'Home', models: ['home'] });
  });

  test('retrieve data models', async () => {
    const models = await Protektor.resource('Home');
    expect(models).toEqual(['home']);
  });

  test('insert additional data model', async () => {
    await Protektor.resource('Reports', ['reports']);
    const db = adapter.toJSON();
    expect(db.resources).toContainEqual({ resourceName: 'Home', models: ['home'] });
    expect(db.resources).toContainEqual({ resourceName: 'Reports', models: ['reports'] });
  });

  test('verify data models for both resources can be retrieved', async () => {
    const homeModels = await Protektor.resource('Home');
    const reportsModels = await Protektor.resource('Reports');
    expect(homeModels).toEqual(['home']);
    expect(reportsModels).toEqual(['reports']);
  });
});
