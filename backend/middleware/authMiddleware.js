const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token , process.env.JWT_SECRET);

    const tokenStatus = await redisClient.get(token);
    if (!tokenStatus) {
      return res.sendStatus(401);
    }
    req.user = payload;
    next();
  }
  catch (error){
    res.sendStatus(403);
  }


};

module.exports = { authenticateToken };
