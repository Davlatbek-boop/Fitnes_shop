function addMinutesToDate(date, minut) {
  return new Date(date.getTime() + minut * 60000);
}

module.exports = { addMinutesToDate };
