const isAndroid = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) return true;
  return false;
};

const isIos = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod/i.test(userAgent)) return true;
  return false;
};

const isMobile = () => {
  if (window.cordova && (isAndroid() || isIos())) {
    return true;
  } else {
    return false;
  }
};

const hybridFunctions = {
  isAndroid,
  isIos,
  isMobile,
};

export default hybridFunctions;
