import Resume from "../models/resumeModel.js";

import fs from "fs";
import path from "path";


export const createResume = async (req, res) => {
        try {
            const {title}=req.body;

            // default tamplete
               const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };
            const newResume = await Resume.create({
                userId: req.user._id,
                title,
                ...defaultResumeData,
                ...req.body,
            });
            res.status(201).json(newResume);
        } catch (error) {
            res.status(500).json({ msg:"faild to create resume", error: error.message });
        }
    }


// get all resumes of a user

export const getUserResumes = async (req, res) => {    
    try{
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updateAt: -1 });
        res.status(200).json(resumes);
    }catch(error) {
        res.status(500).json({ msg:"faild to fetch resumes", error: error.message });
    }   
}


// get single resume of a user

export const getResumeById = async (req, res) => {
    try{const resume = await Resume.findOne({_id:req.params.id,userId:req.user._id})

    if(!resume) {
        return res.status(404).json({ msg:"Resume not found" });
    }   
    res.status(200).json(resume);
}catch(error) {
    res.status(500).json({ msg:"faild to fetch resume", error: error.message });
}
}

// update resume of a user

export const updateResume = async (req, res) => {
    try{
        const resume = await Resume.findOne(
            { _id: req.params.id, userId: req.user._id })
        if(!resume) {
            return res.status(404).json({ msg:"Resume not found" });
        }
        // Merge existing resume data with new data
        Object.assign(resume, req.body);
        const savedResume = await resume.save();
        res.status(200).json(savedResume);
    }catch(error) {
        res.status(500).json({ msg:"faild to update resume", error: error.message });
    }
}


// delete resume of a user

export const deleteResume = async (req, res) => {
    try{
        const resume = await Resume.findOne(
            { _id: req.params.id, userId: req.user._id })
        if(!resume) {
            return res.status(404).json({ msg:"Resume not found" });
        }
       //create a upload folder and store the resume there
       const uploadFolder = path.join(process.cwd(), 'uploads');
       // delete thumbnail if exists
       if(resume.thumbnailLink){
        const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink));
        if(fs.existsSync(oldThumbnail)) {
            fs.unlinkSync(oldThumbnail);
        }

       }
       if(resume.profileInfo?.profilePreviewUrl){
        const oldProfile = path.join(uploadFolder, path.basename(resume.profileInfo.profilePreviewUrl));
        if(fs.existsSync(oldProfile)) {
            fs.unlinkSync(oldProfile);
        }
    }
       // delete resume document

       const deleted = await Resume.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
       });

       if(!deleted) {
        return res.status(404).json({ msg:"Resume not found" });
       }    
         res.status(200).json({ msg:"Resume deleted successfully" });

    }catch(error) {
        res.status(500).json({ msg:"faild to delete resume", error: error.message });
    }
}