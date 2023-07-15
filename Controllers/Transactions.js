
// import Al from "../../frontend/src/pages/AL/Al.js";
import { AF } from "../Models/AF.js"
import { AL } from "../Models/AL.js";
import { PF } from "../Models/PF.js";
import { PL } from "../Models/PL.js";
import { User } from "../Models/User.js"
import { application } from "../Models/application.js"
import cloudinary from "cloudinary"
export const createAF = async (req, res) => {
    try {
        const k = await application.findById("64ad9f0f3f9ccbdf739b90ce");
        const token = "AF" + k.app;
        await application.findByIdAndUpdate("64ad9f0f3f9ccbdf739b90ce", {
            app: k.app + 1
        });
        
        const af = await AF.create({
            token: token,
            from: req.body.user._id,
            fund: req.body.fund,
            file: req.body.file,
            category: req.body.category,
            why: req.body.why,
            percentage: req.body.percentage,
            location: req.body.location,
            profit: req.body.profit,
            name: req.body.name,
            details: req.body.details,
            questions: req.body.questions,
            status: "Active",
        })
        await User.findByIdAndUpdate(req.body.from, {
            $push: { Transactions: token }

        })
        res.status(200).json(af)
    } catch (error) {
        res.status(400).json(error)

    }
}


export const createPF = async (req, res) => {
    try {
        const k = await application.findById("64ad9f0f3f9ccbdf739b90ce");
        const token = "PF" + k.app;
        await application.findByIdAndUpdate("64ad9f0f3f9ccbdf739b90ce", {
            app: k.app + 1
        });

        const pf = await PF.create({
            token: token,
            from: req.body.user._id,
            to: req.body.to,
            quesans:req.body.answers,
            status: "Applied",
        })
        await User.findByIdAndUpdate(req.body.user._id, {
            $push: { transactions: token },
            $push: { notifications:["Your request to get connected to investors in your Startup/Buisness Just got a new Response" , "Active",token] }
        })
        await AF.findOneAndUpdate({ token: req.body.to }, {
            $push: { transactions: req.body.user._id }
        })
        console.log("a")
        res.status(200).json(pf)
    } catch (error) {
        res.status(400).json(error)

    }
}

export const createPL = async (req, res) => {
    console.log(req.body.amount)
    try {
        const k = await application.findById("64ad9f0f3f9ccbdf739b90ce");
        const token = "PL" + k.app;
        await application.findByIdAndUpdate("64ad9f0f3f9ccbdf739b90ce", {
            app: k.app + 1
        });

        const pl = await PL.create({
            token: token,
            from: req.body.from,
            questions: req.body.questions,
            amount: req.body.amount,
            interest_Rate: req.body.interest,
            time: req.body.time,
            details: req.body.details,
            status: "created",
        })
        await User.findByIdAndUpdate(req.body.from, {
            $push: { Transactions: token }

        })

        res.status(200).json(pl)
    } catch (error) {
        res.status(400).json(error)

    }
}


export const createAL = async (req, res) => {
    try {
        const k = await application.findById("64ad9f0f3f9ccbdf739b90ce");
        const token = "AL" + k.app;
        await application.findByIdAndUpdate("64ad9f0f3f9ccbdf739b90ce", {
            app: k.app + 1
        });

        const pl = await AL.create({
            token: token,
            from: req.body.user._id,
            to: req.body.to,
            detailsans:req.body.detailsans,
            quesans:req.body.answers,
            status: "Applied",
        })
        await User.findByIdAndUpdate(req.body.user._id, {
            $push: { transactions: token },
            $push:  {notifications:["A new person applied on your Loan Provider Request. Tab to see it","Active",token]}
        })
        await PL.findOneAndUpdate({ token: req.body.to }, {
            $push: { transactions: req.body.token },
        })
        res.status(200).json(pl)
    } catch (error) {
        res.status(400).json(error)

    }
}


export const allLoans = async (req, res) => {
    try {
        const loans = await PL.find({ amount: { $gt: req.body.amountgt, $lt: req.body.amountlt }, interest_Rate: { $gt: req.body.interestgt, $lt: req.body.interestlt }, })
        console.log(loans)
        res.status(200).json(loans);
    } catch (error) {
        res.status(400).json(error);
    }
}
export const allStartups = async (req, res) => {
    // console.log("sdkns")
    try {
        const startup = await AF.find({})
        res.status(200).json(startup);
    } catch (error) {
        res.status(400).json(error);
    }
}

export const History = async (req, res) => {
    try {
        const { transactions } = await User.findById(req.body.id)
        res.status(200).json(transactions)
    } catch (error) {
        res.status(400).json(error)

    }
}

export const getdetails= async(req,res)=>{
    try {
        const transaction = await AL.findOne({token:req.body.id})
        const {name,isAuthorized} = await User.findById(transaction.from)
        
        res.status(200).json({transaction , name ,isAuthorized})
    } catch (error) {
        res.status(400).json(error)
    }
}

export const acceptloan = async(req,res)=>{
try {
    const user = await AL.findOneAndUpdate({token:req.body.token},{
        status:"Accepted"
    })
    await User.findByIdAndUpdate(user.from,{
        $push:{notifications:["your request for loan just got accepted check out mail for further information","Active",req.body.token]}
    })
    res.status(200).json("success")
} catch (error) {
    res.status(400).json(error)
}
}