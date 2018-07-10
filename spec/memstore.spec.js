import createMemstore from '../src/Store/MemStore';

const memStore = createMemstore();

describe('MemStore', () => {
  it('add permission to non existing role', () => {
    expect(() => memStore.addPermission('read', 'view', false, 'blah')).toThrow(
      'Role blah not found'
    );
  });

  it('look up role that does not exist', () => {
    expect(() => memStore.getRoleByName('admin')).toThrow('Role admin not found');
  });
});
