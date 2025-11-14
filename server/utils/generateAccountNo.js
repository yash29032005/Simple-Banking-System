exports.generateAccountNo = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return `SBS${year}${random}`;
};
