import { ValueService } from './value.service';

describe('ValueService', () => {
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

  describe('Tests for getPromiseValue', () => {
    it('should return "promise" value from promise', async () => {
      const value = await service.getPromiseValue();
      expect(value).toBe('promise value');
    });

    it('should return "promise" value from promise using done', (done) => {
      service.getPromiseValue().then((value) => {
        expect(value).toBe('promise value');
        done();
      });
    });
  });

  describe('Tests for getObservableValue', () => {
    it('should return "observable" value from observable', (done) => {
      service.getObservableValue().subscribe((value) => {
        expect(value).toBe('observable value');
        done();
      });
    });
  });
});
