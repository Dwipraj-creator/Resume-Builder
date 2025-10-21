import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";
import upload from "../middlewares/uploadMiddleware.js";

export const uploadResumeImages = async (req, res) => {
  upload.fields([{ name: "thumbnail" }, { name: "profileImg" }])(req, res, async (err) => {
    if (err) return res.status(400).json({ msg: err.message, err: "file upload failed" });

    try {
      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
      if (!resume) return res.status(404).json({ msg: "Resume not found" });

      const uploadsFolder = path.join(process.cwd(), "uploads");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImg = req.files.profileImg?.[0];

      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      if (newProfileImg) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo = resume.profileInfo || {};
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImg.filename}`;
      }

      await resume.save();
      res.status(200).json({
        msg: "Images uploaded successfully",
        thumbnailLink: resume.thumbnailLink,
        profileImgLink: resume.profileInfo.profilePreviewUrl,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
};
