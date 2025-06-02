let navigate = null;
//안씀
export const setNavigate = (navFn) => {
  navigate = navFn;
};

export const navigateTo = (path) => {
  if (navigate) {
    navigate(path);
  }
};
