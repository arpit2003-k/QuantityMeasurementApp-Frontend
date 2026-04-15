import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { QuantityService } from '../core/services/quantity.service';
import {
  MeasurementType, ActionType, ArithOpType,
  UNITS, MEASUREMENT_TYPES,
  QuantityDTO, QuantityInputDTO, QuantityMeasurementDTO
} from '../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Expose to template
  readonly measurementTypes = MEASUREMENT_TYPES;

  // State
  selectedType: MeasurementType  = 'LengthUnit';
  selectedAction: ActionType     = 'compare';
  selectedArithOp: ArithOpType   = 'add';

  // Units for current type
  currentUnits: string[] = [];

  // Reactive Forms
  compareForm!: FormGroup;
  arithForm!: FormGroup;

  // Results
  compareResult: QuantityMeasurementDTO | null = null;
  arithResult:   QuantityMeasurementDTO | null = null;
  compareError = '';
  arithError   = '';

  // Loading
  compareLoading = false;
  arithLoading   = false;

  // History
  history: QuantityMeasurementDTO[] = [];
  historyMode: 'all' | 'errored' = 'all';
  historyLoading = false;

  // User
  userInitial = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private quantityService: QuantityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInitial = this.authService.getUserInitial();
    this.currentUnits = UNITS[this.selectedType];
    this.buildForms();
    this.loadHistory();
  }

  buildForms(): void {
    const unit = this.currentUnits[0];

    this.compareForm = this.fb.group({
      value1: [null, [Validators.required]],
      unit1:  [unit, Validators.required],
      value2: [null, [Validators.required]],
      unit2:  [unit, Validators.required]
    });

    this.arithForm = this.fb.group({
      value1:     [null, [Validators.required]],
      unit1:      [unit, Validators.required],
      value2:     [null, [Validators.required]],
      unit2:      [unit, Validators.required],
      unitTarget: [unit, Validators.required]
    });
  }

  selectType(type: MeasurementType): void {
    this.selectedType  = type;
    this.currentUnits  = UNITS[type];
    this.compareResult = null;
    this.arithResult   = null;
    this.compareError  = '';
    this.arithError    = '';
    this.buildForms();
    this.loadHistory();
  }

  selectAction(action: ActionType): void {
    this.selectedAction = action;
    this.compareResult  = null;
    this.arithResult    = null;
    this.compareError   = '';
    this.arithError     = '';
  }

  selectArithOp(op: ArithOpType): void {
    this.selectedArithOp = op;
    this.arithResult     = null;
    this.arithError      = '';
  }

  get arithSymbol(): string {
    return { add: '+', subtract: '−', divide: '÷' }[this.selectedArithOp];
  }

  // BUILD QuantityDTO
  private qty(value: number, unit: string): QuantityDTO {
    return { value, unit, measurementType: this.selectedType };
  }

  // COMPARE / CONVERT
  onCalculate(): void {
    if (this.compareForm.invalid) {
      this.compareForm.markAllAsTouched();
      return;
    }

    const { value1, unit1, value2, unit2 } = this.compareForm.value;
    const input: QuantityInputDTO = {
      thisQuantityDTO: this.qty(value1, unit1),
      thatQuantityDTO: this.qty(value2, unit2)
    };

    this.compareLoading = true;
    this.compareResult  = null;
    this.compareError   = '';

    const call = this.selectedAction === 'convert'
      ? this.quantityService.convert(input)
      : this.quantityService.compare(input);

    call.subscribe({
      next: (res) => {
        this.compareResult  = res;
        this.compareLoading = false;
        this.loadHistory();
      },
      error: (err) => {
        this.compareError   = err.error?.message || 'Calculation failed. Please try again.';
        this.compareLoading = false;
      }
    });
  }

  // ARITHMETIC
  onArithCalculate(): void {
    if (this.arithForm.invalid) {
      this.arithForm.markAllAsTouched();
      return;
    }

    const { value1, unit1, value2, unit2, unitTarget } = this.arithForm.value;

    const input: QuantityInputDTO = {
      thisQuantityDTO: this.qty(value1, unit1),
      thatQuantityDTO: this.qty(value2, unit2),
      targetUnit: unitTarget
    };

    this.arithLoading = true;
    this.arithResult  = null;
    this.arithError   = '';

    let call;
    switch (this.selectedArithOp) {
      case 'add':      call = this.quantityService.add(input);      break;
      case 'subtract': call = this.quantityService.subtract(input); break;
      case 'divide':   call = this.quantityService.divide(input);             break;
    }

    call.subscribe({
      next: (res) => {
        this.arithResult  = res;
        this.arithLoading = false;
        this.loadHistory();
      },
      error: (err) => {
        this.arithError   = err.error?.message || 'Calculation failed. Please try again.';
        this.arithLoading = false;
      }
    });
  }

  // FORMAT RESULT
  formatResult(result: QuantityMeasurementDTO): string {
    if (result.error && result.errorMessage) return result.errorMessage;
    if (result.resultString === 'true')  return '✓ Equal';
    if (result.resultString === 'false') return '✗ Not Equal';
    if (result.resultString && result.resultString !== 'null') return result.resultString;
    if (result.resultUnit) return `${this.round(result.resultValue)} ${result.resultUnit}`;
    return this.round(result.resultValue).toString();
  }

  private round(n: number): number {
    return parseFloat(n.toFixed(6));
  }

  // HISTORY
  loadHistory(): void {
    this.historyLoading = true;
    const call = this.historyMode === 'errored'
      ? this.quantityService.getErrorHistory()
      : this.quantityService.getHistoryByType(this.selectedType);

    call.subscribe({
      next: (res) => { this.history = res.reverse(); this.historyLoading = false; },
      error: ()    => { this.historyLoading = false; }
    });
  }

  setHistoryMode(mode: 'all' | 'errored'): void {
    this.historyMode = mode;
    this.loadHistory();
  }

  formatHistoryResult(item: QuantityMeasurementDTO): string {
    if (item.error) return 'Error';
    if (item.resultString === 'true')  return '✓ Equal';
    if (item.resultString === 'false') return '✗ Not Equal';
    if (item.resultUnit) return `${this.round(item.resultValue)} ${item.resultUnit}`;
    return this.round(item.resultValue).toString();
  }

  // LOGOUT
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
