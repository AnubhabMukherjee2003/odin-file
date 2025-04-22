const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDashboard = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  try {
    // fetch user's folders
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { name: "asc" },
    });

    // select a folder via query or default to the first
    const selectedFolderId = req.query.folderId
      ? parseInt(req.query.folderId, 10)
      : folders[0]?.id || null;

    // fetch files for that folder
    const files = selectedFolderId
      ? await prisma.file.findMany({
          where: { folderId: selectedFolderId },
          orderBy: { time: "desc" },
        })
      : [];

    res.render("dashboard", {
      user: req.user,
      folders,
      selectedFolderId,
      files,
    });
  } catch (error) {
    next(error);
  }
};