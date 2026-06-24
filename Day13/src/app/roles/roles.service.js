import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { users } from "../../schema/user.schema.js";
import { employeeManagerMapping } from "../../schema/employee-manager.schema.js";
import { ApiError } from "../../utils/ApiErrorResponse.js";
import { ROLES } from "../../constants/roles.js";

export const assignRole = async ({ userId, role }, currentUser) => {
  if (userId === currentUser.id) {
    throw new ApiError(400, "You cannot change your own role.");
  }

  const [targetUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    throw new ApiError(404, "User not found.");
  }

  // If target user was an RM and is being changed to another role,
  // delete mappings for all EMPs who were reporting to this RM.
  if (targetUser.role === ROLES.RM && role !== ROLES.RM) {
    await db
      .delete(employeeManagerMapping)
      .where(eq(employeeManagerMapping.managerId, userId));
  }

  // If the new role is NOT EMP, clear their own manager assignment
  if (role !== ROLES.EMP) {
      await db
        .delete(employeeManagerMapping)
        .where(eq(employeeManagerMapping.employeeId, userId));
  }

  const [updatedUser] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning();

  const { passwordHash, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};