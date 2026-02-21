const extractTenant = (req, res, next) => {
  const host = req.headers.host;
  if (!host) return next();

  const hostname = host.split(":")[0]; // remove port
  const parts = hostname.split(".");

  // Case 1: tenant.localhost
  if (parts.length === 2 && parts[1] === "localhost") {
    req.tenant = parts[0];
  }
  // Case 2: tenant.propertydealer.test
  else if (parts.length >= 3) {
    req.tenant = parts[0];
  }
  // No tenant
  else {
    req.tenant = null;
  }

  next();
};

module.exports = extractTenant;
