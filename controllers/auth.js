const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getIndex = (req, res) => {
  res.render("index", { user: req.user });
};

exports.getSignUp = (req, res) => {
  res.render("sign-up-form");
};

exports.postSignUp = async (req, res, next) => {
  try {
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      },
    });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

exports.getLogin = (req, res) => {
  res.render("login-form");
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};