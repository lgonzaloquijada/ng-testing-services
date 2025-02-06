import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<ValueService>(['getValue']);

    TestBed.configureTestingModule({
      providers: [MasterService, { provide: ValueService, useValue: spy }],
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    // it('should return "real value" from the real service', () => {
    //   const valueService = new ValueService();
    //   const masterService = new MasterService(valueService);
    //   expect(masterService.getValue()).toBe('real value');
    // });

    // it('should return "fake value" from the fake service', () => {
    //   const valueFakeService = new ValueFakeService();
    //   const masterService = new MasterService(
    //     valueFakeService as unknown as ValueService
    //   );
    //   expect(masterService.getValue()).toBe('fake value');
    // });

    // it('should return "fake value object" from the fake object', () => {
    //   const fake = { getValue: () => 'fake value object' };
    //   const masterService = new MasterService(fake as ValueService);
    //   expect(masterService.getValue()).toBe('fake value object');
    // });

    it('should call to getValue from ValueService', () => {
      valueServiceSpy.getValue.and.returnValue('fake value');
      expect(masterService.getValue()).toBe('fake value');
      expect(valueServiceSpy.getValue).toHaveBeenCalled();
      expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
    });
  });
});
