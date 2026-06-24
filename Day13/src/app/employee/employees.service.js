import { eq, or } from "drizzle-orm";
import { db } from "../../config/db.js";
import { users } from "../../schema/user.schema.js";
import { employeeManagerMapping } from "../../schema/employee-manager.schema.js";
import { ApiError } from "../../utils/ApiErrorResponse.js";
import { ROLES } from "../../constants/roles.js";

export const getEmployees = async (currentUser) => {
  let employeeList;

  switch (currentUser.role) {
    case ROLES.RM:
      // RM sees only their own assigned employees
      // We join users with employeeManagerMapping to get only their mapped EMPs
      employeeList = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        })
        .from(users)
        .innerJoin(employeeManagerMapping, eq(users.id, employeeManagerMapping.employeeId))
        .where(eq(employeeManagerMapping.managerId, currentUser.id));
      break;

    case ROLES.APE:
      employeeList = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        })
        .from(users)
        .where(or(eq(users.role, ROLES.EMP), eq(users.role, ROLES.RM)));
      break;

    case ROLES.CFO:
      employeeList = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
      }).from(users);
      break;

    default:
      throw new ApiError(403, "You do not have permission to view employees.");
  }

  return employeeList;
};

export const assignEmployee = async ({ employeeId, managerId }) => {
  const [[employee], [manager]] = await Promise.all([
    db.select().from(users).where(eq(users.id, employeeId)).limit(1),
    db.select().from(users).where(eq(users.id, managerId)).limit(1),
  ]);

  if (!employee) {
    throw new ApiError(404, "Employee not found.");
  }
  if (!manager) {
    throw new ApiError(404, "Manager not found.");
  }

  if (employee.role !== ROLES.EMP) {
    throw new ApiError(400, "Only users with role EMP can be assigned to a manager.");
  }

  if (manager.role !== ROLES.RM) {
    throw new ApiError(400, "Only users with role RM can be assigned as a manager.");
  }

  // Check if employee is already assigned
  const [existingMapping] = await db
    .select()
    .from(employeeManagerMapping)
    .where(eq(employeeManagerMapping.employeeId, employeeId))
    .limit(1);

  if (existingMapping) {
    throw new ApiError(
      400,
      "Employee is already assigned to a manager. Remove the current assignment first."
    );
  }

  // Insert mapping
  await db
    .insert(employeeManagerMapping)
    .values({ employeeId, managerId });

  const { passwordHash, ...employeeWithoutPassword } = employee;
  return employeeWithoutPassword;
};

export const removeAssignment = async ({ employeeId, managerId }) => {
  const [employee] = await db
    .select()
    .from(users)
    .where(eq(users.id, employeeId))
    .limit(1);

  if (!employee) {
    throw new ApiError(404, "Employee not found.");
  }

  // Verify the assignment exists
  const [existingMapping] = await db
    .select()
    .from(employeeManagerMapping)
    .where(eq(employeeManagerMapping.employeeId, employeeId))
    .limit(1);

  if (!existingMapping || existingMapping.managerId !== managerId) {
    throw new ApiError(
      400,
      "Employee is not assigned to this manager."
    );
  }

  // Delete mapping
  await db
    .delete(employeeManagerMapping)
    .where(eq(employeeManagerMapping.employeeId, employeeId));

  const { passwordHash, ...employeeWithoutPassword } = employee;
  return employeeWithoutPassword;
};