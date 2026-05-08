const formatDateToBR = (dateValue) => {
  if (!dateValue) return null;

  return new Date(dateValue).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
};


export default formatDateToBR