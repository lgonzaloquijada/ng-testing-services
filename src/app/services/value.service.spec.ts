import { ValueService } from './value.service';

fdescribe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    service = new ValueService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return real value', () => {
      expect(service.getValue()).toBe('real value');
    });
  });

  describe('Tests for setValue', () => {
    it('should change value', () => {
      expect(service.getValue()).toBe('real value');
      service.setValue('new value');
      expect(service.getValue()).toBe('new value');
    });
  });
});
