// ===================== AUTH MODELS =====================
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    mobileNumber: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

// Matches backend measurementType values exactly
export type MeasurementType = 'LengthUnit' | 'WeightUnit' | 'TemperatureUnit' | 'VolumeUnit';

// All valid units per type — exact backend enum values
export const UNITS: Record<MeasurementType, string[]> = {
    LengthUnit: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
    WeightUnit: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
    TemperatureUnit: ['CELSIUS', 'FAHRENHEIT'],
    VolumeUnit: ['LITRE', 'MILLILITER', 'GALLON']
};

export const MEASUREMENT_TYPES: { key: MeasurementType; label: string; icon: string }[] = [
    { key: 'LengthUnit', label: 'Length', icon: 'https://cdn-icons-png.flaticon.com/512/1875/1875639.png' },
    { key: 'WeightUnit', label: 'Weight', icon: 'https://cdn-icons-png.flaticon.com/512/2454/2454295.png' },
    { key: 'TemperatureUnit', label: 'Temperature', icon: 'https://cdn-icons-png.flaticon.com/512/1684/1684375.png' },
    { key: 'VolumeUnit', label: 'Volume', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' }
];

// Matches backend QuantityDTO exactly
export interface QuantityDTO {
    value: number;
    unit: string;
    measurementType: MeasurementType;
}

// Matches backend QuantityInputDTO exactly
export interface QuantityInputDTO {
    thisQuantityDTO: QuantityDTO;
    thatQuantityDTO: QuantityDTO;
    targetUnit?: string;
}

// Matches backend QuantityMeasurementDTO exactly
export interface QuantityMeasurementDTO {
    thisValue: number;
    thisUnit: string;
    thisMeasurementType: string;
    thatValue: number;
    thatUnit: string;
    thatMeasurementType: string;
    operation: string;
    resultString: string;
    resultValue: number;
    resultUnit: string;
    resultMeasurementType: string;
    errorMessage: string;
    error: boolean;
}

export type ActionType = 'compare' | 'convert' | 'arithmetic';
export type ArithOpType = 'add' | 'subtract' | 'divide';