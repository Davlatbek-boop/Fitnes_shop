module.exports = function (req, res, next) {
  const id = req.params.id;

  if(req.user.role == "owner" || req.user.role == "client"){
    return res.status(403).send({
      message: `Siz ${req.user.role} sifatida Admin malumotlariga kira olmaysiz`,
    });
  }

  if (req.user.role!=="creator"){
    if (id != req.user.id) {
      return res.status(403).send({
        message: "Ruxsat faqat shaxsiy malumotlar uchun",
      });
    }
  }

  next();
}; 
