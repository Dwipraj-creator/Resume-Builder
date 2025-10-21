import React, { useContext, useState } from 'react'
import { authStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axioInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { validateEmail } from '../utils/helper';
import { Inputs } from './Inputs';

const Signup = ({setCurrentPage}) => {
    
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();



 const handleSignUp = async(e)=>{
    e.preventDefault();
    if(!fullName){
        setError("Please Enter Full Name") 
        return
    }
    if(!validateEmail(email)){
        setError('Please Enter A Valid Email Address')
        return
    }
    if(!password){
        setError('Please Enter Password')
        return 
    }
    setError("")

    try {
        const response = await axioInstance.post(API_PATHS.AUTH.REGISTER , {
            name:fullName,
            email,
            password,
        });
        const {token}= response.data;
        if(token){
            localStorage.setItem("token",token);
            updateUser(response.data);
            navigate("/dashboard");
        }
    } catch (error) {
        setError(error.response?.data?.message || "Something went wrong. Please try again.")
    }
 }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>Join thousands of professionals today</p>
      </div>

      {/* form */}

      <form onSubmit={handleSignUp} className={styles.signupForm}>
        <Inputs value={fullName} onChange={({target})=> setFullName(target.value)}
        label="Full Name"
        placeholder="John Doe"
        type='text' />

         <Inputs value={email} onChange={({target})=> setEmail(target.value)}
        label="Email"
        placeholder="email@example.com"
        type='email' />

         <Inputs value={password} onChange={({target})=> setPassword(target.value)}
        label="Password"
        placeholder="min 8 charachers"
        type='password' />

        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type='submit' className={styles.signupSubmit}>
            Create Account 
        </button>

        {/* Footer */}
        <p className={styles.switchText}>
            Already have an account ? {' '}
            <button 
            onClick={()=>setCurrentPage("login")} type='button' className={styles.signupSwitchButton}>
                Sign In 
            </button>
        </p>
      </form>
    </div>
  )
}

export default Signup
