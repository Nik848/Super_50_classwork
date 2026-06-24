/**
 * EMPLOYEES CONTROLLER
 *
 * Responsibilities:
 * - Receive request
 * - Call service
 * - Return standardized response
 *
 * No business logic here.
 */

/**
 * IMPLEMENTATION:
 *
 * getEmployees(req, res):
 * - Passes req.user to employee service for role-based filtering
 * - Returns 200 OK with the filtered employee list
 *
 * assignEmployee(req, res):
 * - Extracts validated body (employeeId, managerId) from req.body
 * - Calls employee service assignEmployee
 * - Returns 200 OK with updated employee
 *
 * removeAssignment(req, res):
 * - Extracts validated body (employeeId, managerId) from req.body
 * - Calls employee service removeAssignment
 * - Returns 200 OK with updated employee
 */
import * as employeesService from "./employees.service.js";
import { ApiResponse } from "../../utils/ApiSuccessResponse.js";

/**
 * Handle employee listing (role-based visibility)
 * GET /rest/employees
 */
export const getEmployees = async (req, res) => {
  try {
    // Call the employee service — it filters based on req.user's role
    const employees = await employeesService.getEmployees(req.user);

    // Return 200 OK with the employee list
    const response = new ApiResponse(200, "Employees fetched successfully.", employees);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch employees.",
    });
  }
};

/**
 * Handle employee assignment (EMP → RM)
 * POST /rest/employees/assign
 */
export const assignEmployee = async (req, res) => {
  try {
    const { employeeId, managerId } = req.body;

    // Call the employee service to assign the employee to the manager
    const updatedEmployee = await employeesService.assignEmployee({
      employeeId,
      managerId,
    });

    // Return 200 OK with the updated employee
    const response = new ApiResponse(
      200,
      "Employee assigned to manager successfully.",
      updatedEmployee
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Employee assignment failed.",
    });
  }
};

/**
 * Handle removing employee assignment (clear EMP → RM link)
 * DELETE /rest/employees/assign
 */
export const removeAssignment = async (req, res) => {
  try {
    const { employeeId, managerId } = req.body;

    // Call the employee service to remove the assignment
    const updatedEmployee = await employeesService.removeAssignment({
      employeeId,
      managerId,
    });

    // Return 200 OK with the updated employee
    const response = new ApiResponse(
      200,
      "Employee assignment removed successfully.",
      updatedEmployee
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to remove assignment.",
    });
  }
};
