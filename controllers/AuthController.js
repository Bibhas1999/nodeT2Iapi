import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()
class AuthController {
    
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if(email && password){
        const user = await User.findOne({ email: email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const id = user._id
            const token = jwt.sign({id},process.env.JWT_SECRET_KEY)
            var oneWeek = 7 * 24 * 3600 * 1000
             res.cookie("jwtoken",token,{
              expires: new Date(Date.now() + oneWeek),
              httpOnly:true
             })
            res.status(200)
            res.json({
              msg:'Login Successful',
              _id: user._id,
              name: user.name,
              email: user.email,   
              status: '200'
          });
        } else { 
           res.status(401).json({ msg: "Email or Password is Invalid!",status:'401' });
        }
      }else{
         res.json({ msg: "Email or Password must be filled!" });
      }
      
    } catch (error) {
        console.log(error)
        res.json({ error: error, status: 404 });
    }
  };

  static register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await User.findOne({ email: email });
        if (!result) {
          let hashedPassword = bcrypt.hashSync(password, 10);
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });
          await user.save();
          const id = user._id
          const token = jwt.sign({id},process.env.JWT_SECRET_KEY,{
            expiresIn:'2h'
         })
         var oneWeek = 7 * 24 * 3600 * 1000
         res.cookie("jwtoken",token,{
          expires: new Date(Date.now() + oneWeek),
          httpOnly:true
         })
          return res.status(200).json({ msg: "Registered Successfully",_id:user.id,name:user.name,email:user.email})
        }
          res.status(401).json({ msg: "Email already exists"});
      } catch (error) {
        console.log(error);
        return res.json({ error: error, status: "500" });
      }
  };

  static logout = async (req,res)=>{
    try {
      const token = req.cookies.jwtoken;
      if(token){
        res.clearCookie('jwtoken')
        res.send('you have been logged out')
      }else{
        res.send('you have not logged in yet')
      }
    } catch (error) {
      
    }
  }
   
}
export default AuthController;
