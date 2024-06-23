export const getServiceName = (type) => {
  const services = [
    { code: "OW", name: "ONE-WAY" },
    { code: "RT", name: "ROUND-TRIP" },
    { code: "CH", name: "CHARTER" },
    { code: "DH", name: "DEAD-HEAD" },
    { code: "SH", name: "SHUTTLE" },
  ];

  const isCodeFound = services.find((e) => e.code === type);
  if (isCodeFound) return services.find((e) => e.code === type)?.name;
  else return type;
};
