const validateEmail = (email) => {
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) return false;
  else return true;
};

export { validateEmail };
