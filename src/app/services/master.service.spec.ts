import { MasterService } from './master.service';
import { ValueFakeService } from './value-fake.service';
import { ValueService } from './value.service';

fdescribe('MasterService', () => {
  describe('Tests for getValue', () => {
    it('should return "real value" from the real service', () => {
      const valueService = new ValueService();
      const masterService = new MasterService(valueService);
      expect(masterService.getValue()).toBe('real value');
    });

    it('should return "fake value" from the fake service', () => {
      const valueFakeService = new ValueFakeService();
      const masterService = new MasterService(
        valueFakeService as unknown as ValueService
      );
      expect(masterService.getValue()).toBe('fake value');
    });

    it('should return "fake value object" from the fake object', () => {
      const fake = { getValue: () => 'fake value object' };
      const masterService = new MasterService(fake as ValueService);
      expect(masterService.getValue()).toBe('fake value object');
    });
  });
});
