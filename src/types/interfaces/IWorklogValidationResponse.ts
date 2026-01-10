export interface IWorklogValidationResponse {
  canLogWork: boolean;
  reason?: string;
  weeklyHoursWorked?: number;
  estimatedHoursPerWeek?: number;
  contractStatus?: string;
}
