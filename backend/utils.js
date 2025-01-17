import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    "djy843hnfv9",
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization
 
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token,"djy843hnfv9", (err, decode) => {
      if (err) {
        console.log(err)
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        console.log("nestxted")
        req.user = decode;
        next();
      }
    });
  } else {
    console.log(authorization)
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    next()
  }
};
