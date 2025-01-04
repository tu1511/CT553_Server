const ADMIN = "ADMIN";
const EMPLOYEE = "EMPLOYEE";
const USER = "USER";

const ROLES = {
  1: ADMIN,
  2: EMPLOYEE,
  3: USER,
};

const getRole = (roleId) => {
  return ROLES[roleId];
};

module.exports = { ADMIN, EMPLOYEE, USER, getRole };
