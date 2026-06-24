/**
 * ROLES CONSTANTS
 *
 * Defines all valid roles in the RBAC system.
 * Used across the application for role checks, validation, and assignment.
 *
 * Roles:
 * - EMP: Employee (default role assigned on registration)
 * - RM:  Reporting Manager (manages EMPs)
 * - APE: Approving Entity (can view all EMP + RM)
 * - CFO: Chief Financial Officer (full access, assigns roles)
 */

// Frozen object to prevent accidental mutation of role values
export const ROLES = Object.freeze({
  EMP: "EMP",
  RM: "RM",
  APE: "APE",
  CFO: "CFO",
});

// Array of all valid role strings — used in Zod enum validation and DB schema
export const VALID_ROLES = Object.values(ROLES);
