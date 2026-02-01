export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🔐 allowRoles middleware hit");
    console.log("👉 User attached from DB:", req.user);
    console.log(" Role from DB:", req.user?.role);
    console.log(" Allowed roles:", allowedRoles);

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log("Access denied");
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    console.log(" Access granted");
    next();
  };
};
