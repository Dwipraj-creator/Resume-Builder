import mongoose from "mongoose";
const resumeSchema =  new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:{ type: String, required: true },
    thumbnailLink: { type: String },
    template: {theme:String,colorPalette:[String]},
    profileInfo: {
        profilePreviewUrl: String,
        fullName: String,
        designation: String,
        summary: String,
    },
    contactInfo: {
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
    },
    // work experience
    workExperience: [{company:String, role:String, startDate:Date, endDate:Date,description:String},],
    //education
    education: [{institution:String, degree:String, startDate:Date, endDate:Date},],
    // skills
    skills: [{ name:String, progress:Number },],
    // projects
    projects: [{ title:String, github:String, description:String,liveDemo:String },],
    certifications: [{ title:String, issuer:String, year:String },],
   languages: [{ name:String, progress:Number },],
    interests:[String],
}, { timestamps: {createdAt:"createAt",updatedAt:"updateAt"} });

export default mongoose.model("Resume", resumeSchema);