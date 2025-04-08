const { errorHandler } = require("../../helpers/error_handler");
const JwtService = require("../../services/jwt.service");
const config = require("config");

async function adminJwt(token) {
  try {
    const jwtService = new JwtService(
      config.get("admin_access_key"),
      config.get("admin_refresh_key"),
      config.get("admin_access_time"),
      config.get("admin_refresh_time")
    );
    return await jwtService.verifyAccessToken(token);
  } catch (error) {
    return null;
  }
}

async function clientJwt(token) {
  try {
    const jwtService = new JwtService(
      config.get("client_access_key"),
      config.get("client_refresh_key"),
      config.get("client_access_time"),
      config.get("client_refresh_time")
    );
    return await jwtService.verifyAccessToken(token);
  } catch (error) {
    return null;
  }
}

async function ownerJwt(token) {
  try {
    const jwtService = new JwtService(
      config.get("owner_access_key"),
      config.get("owner_refresh_key"),
      config.get("owner_access_time"),
      config.get("owner_refresh_time")
    );
    return await jwtService.verifyAccessToken(token);
  } catch (error) {
    return null;
  }
}

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res
        .status(403)
        .send({ message: "authorization token berilmagan" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer != "Bearer" || !token) {
      return res.status(403).send({ message: "bearer yoki token berilmagan" });
    }


    const admin = await adminJwt(token);
    if (admin) {
      req.user = admin;
      if(req.user.is_creator){
        req.user.role = "creator"
      }
    }

    const client = await clientJwt(token);
    if (client) {
      req.user = client;
    }

    const owner = await ownerJwt(token);
    if (owner) {
      req.user = owner;
    }

    if (!req.user) {
      return res
        .status(401)
        .send({ message: "Yaroqsiz token yoki imzo noto'g'ri" });
    }
    // console.log(req.user);
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
