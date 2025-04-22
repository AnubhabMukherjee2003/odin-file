const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const prisma = new PrismaClient();

// Use environment variables for Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getNewFolder = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.render("folder-form");
};

exports.postNewFolder = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  try {
    await prisma.folder.create({
      data: {
        name: req.body.name,
        userId: req.user.id,
      },
    });
    res.redirect("/dashboard");
  } catch (err) {
    return next(err);
  }
};

exports.getAddFile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  const folder = await prisma.folder.findUnique({
    where: { id: parseInt(req.params.id), userId: req.user.id },
  });
  if (!folder) {
    return res.status(404).send("Folder not found");
  }
  res.render("addFile", { user: req.user, id: req.params.id });
};

exports.postAddFile = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const folderId = parseInt(req.params.id, 10);
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.file.originalname,
      resource_type: "auto",
    });
    console.log("Upload result:", uploadResult);
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        publicId: uploadResult.public_id,
        size: uploadResult.bytes,
        folderId: folderId,
      },
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in /addFile:", error);
    next(error);
  }
};

// New controller for downloading a file
exports.getFile = async (req, res, next) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });
    
    if (!file) {
      return res.status(404).send("File not found");
    }
    
    // Get file extension to determine resource type
    const extension = file.name.split('.').pop().toLowerCase();
    
    // List of common image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
    
    let resourceType = 'raw'; // Default to raw
    if (imageExtensions.includes(extension)) {
      resourceType = 'image';
    } else if (videoExtensions.includes(extension)) {
      resourceType = 'video';
    }
    
    // For Cloudinary files, construct the URL with appropriate resource type
    const cloudinaryUrl = cloudinary.url(file.publicId, {
      resource_type: resourceType,
      secure: true
    });
    
    console.log("File found:", file);
    console.log("Cloudinary URL:", cloudinaryUrl);
    
    res.redirect(cloudinaryUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    next(error);
  }
};

// New controller for deleting a file
exports.deleteFile = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    
    const fileId = parseInt(req.params.id, 10);
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { folder: true },
    });
    
    if (!file || file.folder.userId !== req.user.id) {
      return res.status(404).send("File not found or access denied");
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);
    
    // Delete from database
    await prisma.file.delete({
      where: { id: fileId },
    });
    
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error deleting file:", error);
    next(error);
  }
};