const detectSubDomain = () => {
  let subDomain;
  let hostname = window.location.hostname;

  // Ensure hostname includes 'www' if missing
  if (!hostname.startsWith('www.')) {
    hostname = 'www.' + hostname; //www.bookyourappointment.online or www.visooptica.bookyourappointment.online

    const parts = hostname.split('.');
    const isSubdomain = parts.length > 2;

    if (isSubdomain) {
      subDomain = parts[1];
    }
  }

  return subDomain;
};

export default detectSubDomain;
