import ProtektorMemAdapter from '../src/ProtektorMemAdapter';
import Protektor from '../src/Protektor';

const adapter = new ProtektorMemAdapter();
Protektor.registerAdapter(adapter);

describe('Protektor with mem adapter', () => {
  test('insert data models', () => {
    Protektor.resource('Home', ['home']);
    const db = adapter.toJSON();
    expect(db.resources).toContainEqual({ resourceName: 'Home', models: ['home'] });
  });

  test('retrieve data models', () => {
    const models = Protektor.resource('Home');
    expect(models).toEqual(['home']);
  });

  test('insert additional data model', () => {
    Protektor.resource('Reports', ['reports']);
    const db = adapter.toJSON();
    expect(db.resources).toContainEqual({ resourceName: 'Home', models: ['home'] });
    expect(db.resources).toContainEqual({ resourceName: 'Reports', models: ['reports'] });
  });

  test('verify data models for both resources can be retrieved', () => {
    const homeModels = Protektor.resource('Home');
    const reportsModels = Protektor.resource('Reports');
    expect(homeModels).toEqual(['home']);
    expect(reportsModels).toEqual(['reports']);
  });
});
