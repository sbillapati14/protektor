import { getResourceName, getModelName } from '../src/utils';

describe('Utils', () => {
  it('invalid resource name', () => {
    expect(() => getResourceName(undefined)).toThrow('InvalidResourceTypeError');
  });

  it('invalid model name', () => {
    expect(() => getModelName(undefined)).toThrow('InvalidModelTypeError');
  });
});
