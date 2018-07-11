import { getResourceName, requiredParam } from '../src/utils';

describe('Utils', () => {
  it('invalid resource name', () => {
    expect(() => getResourceName(undefined)).toThrow('InvalidResourceTypeError');
  });
});
