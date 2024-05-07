const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return res.sendStatus(401);
    //compare the role that came in the request with the role for the route
    const result = allowedRoles.find((val) => val === req.role);
    console.log(result);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
