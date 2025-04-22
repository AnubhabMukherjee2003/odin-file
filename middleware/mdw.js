const path = require("node:path");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const passport = require("./passport");
const express = require("express");

module.exports = (app) => {
  app.use(express.static(path.join(__dirname, "..", "public")));
  // Configure view engine
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "ejs");

  // Session middleware
  app.use(
    session({
      secret: "cats",
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, // ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    })
  );

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Body parser middleware
  app.use(express.urlencoded({ extended: false }));
};
