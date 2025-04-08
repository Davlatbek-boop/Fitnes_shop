function formatPhoneNumber(number) {
  const digits = number.replace(/\D/g, "");

  if (digits.length === 9) {
    return `+998${digits}`;
  } else {
    return "Noto‘g‘ri raqam formati!";
  }
}

module.exports = {formatPhoneNumber};
