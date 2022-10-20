import User from "../../models/User.js ";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

//  const authCheck = async(req,res,next)=>{

//       let token
//       if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//           token = req.headers.authorization.split(' ')[1]
//           const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
//           req.user = await User.findById(decoded.id).select('-password')
//           next()
//         } catch (error) {
//           console.log(error)
//           res.status(401)
//           res.json({msg:'Not Authorized'})
//         }
//       }
//       if(!token){
//           res.status(401)
//           res.json({msg:'Unauthorized! No token found '})
//       }

//   }
const authCheck = async (req, res, next) => {
  try {
    let token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken.id });
    if (!rootUser) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized! No token found');
  }
};

export default authCheck;
