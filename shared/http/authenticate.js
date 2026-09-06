import AppError from "../errors/appError.js";
import { verifyToken } from "../security/jwt.js";

// Protects every route mounted after this middleware in app.js. Attaches the
// decoded token as `req.auth = { collaboratorId, organizationId, role }` —
// controllers should prefer this over trusting an organizationId/
// collaboratorId sent in the request body.
export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    req.auth = verifyToken(token);
  } catch (error) {
    throw new AppError("Invalid or expired session", 401);
  }

  next();
}

// Usage: router.post("/", requireRole(0, 1), controller.create)
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth) throw new AppError("Authentication required", 401);
    if (!allowedRoles.includes(req.auth.role)) {
      throw new AppError("You don't have permission to do this", 403);
    }
    next();
  };
}

// Guards a route whose URL carries an organization id (e.g. `/:orgId`,
// `/dash/:id`) — rejects with 403 unless it matches the caller's own
// organization from the verified token. Without this, a valid token from
// org A could read org B's data by editing the URL.
// Usage: router.get("/:orgId", ownOrganizationOnly("orgId"), controller.get)
export function ownOrganizationOnly(paramName = "id") {
  return (req, res, next) => {
    if (!req.auth) throw new AppError("Authentication required", 401);
    if (+req.params[paramName] !== req.auth.organizationId) {
      throw new AppError("You don't have permission to access this organization's data", 403);
    }
    next();
  };
}
