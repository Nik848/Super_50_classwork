/*
  ORIGINAL COMMENT:
  dto to validate logout endpoint
  return:
  {
      success:true,
      message:"ok",
      error:null
  }

  IMPLEMENTATION:
  - Logout requires no request body validation
  - validateLogout is a pass-through middleware
  - The response shape { success, message, error } is handled in the controller
*/

// Express middleware: no validation needed for logout, just pass through
export const validateLogout = (req, res, next) => {
  next();
};