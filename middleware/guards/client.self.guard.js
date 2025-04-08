module.exports = function (req, res, next) {
  const id = req.params.id;

  if(req.user.role == "owner"){
    return res.status(403).send({
      message: `Siz ${req.user.role} sifatida Admin malumotlariga kira olmaysiz`,
    });
  }

  if (req.user.role !== "Admin") {
    if (id != req.user.id) {
      return res.status(403).send({
        message: "Ruxsat faqat shaxsiy malumotlar uchun",
      });
    }
  }

  next();
};
