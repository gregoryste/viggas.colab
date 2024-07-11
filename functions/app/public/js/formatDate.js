function formatDate(data){

  let date = new Date(data.seconds * 1000 + data.nanoseconds / 1000000);
  
  // Define the month names in the desired language
  let monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];
  
  // Format the date string
  const formattedDate = `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()} às ${date.getHours()}:${date.getMinutes()}`;
  
  // Segundos: :${date.getSeconds()}

  return formattedDate;
}

module.exports = formatDate;