import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axioInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { authStyles as styles } from '../assets/dummystyle';
import { Inputs } from './Inputs';
import { validateEmail } from '../utils/helper';

const Login = ({setCurrentPage}) => {
      const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async(e)=>{
    e.preventDefault();

    if(!validateEmail(email)){
            setError('Please Enter A Valid Email Address')
            return
        }
        if(!password){
            setError('Please Enter Password')
            return 
        }

        setError("");

            try {
                const response = await axioInstance.post(API_PATHS.AUTH.LOGIN,{email,password})
                const {token}=response.data

                if(token){
                    localStorage.setItem("token",token)
                    navigate("/dashboard")
                }
            } catch (error) {
                setError(error.response?.data?.message || "Something went wrong . Please try again")   
            }

  }
  return (
    <div className={styles.container}>
        <div className={styles.headerWrapper}>
            <h3 className={styles.title}> Welcome Back</h3>
            <p className={styles.subtitle}>
                Sign in to continue building amazing resumes 
            </p>
        </div>

      {/* Form tag */}

       <form onSubmit={handleLogin} className={styles.form}>
         <Inputs value={email} onChange={({target})=> setEmail(target.value)}
                label="Email"
                placeholder="hexagonservices@example.com"
                type='email' />
        
                 <Inputs value={password} onChange={({target})=> setPassword(target.value)}
                label="Password"
                placeholder="min 8 charachers"
                type='password' />

                 {error && <div className={styles.errorMessage}>{error}</div>}

                 <button type='submit' className={styles.submitButton}>
                        Sign In 
                 </button>

                 <p className={styles.switchText}>
                    Don't have an account {" "}
                    <button type='button' className={styles.switchButton} onClick={()=>setCurrentPage("signup")}>
                        Sign Up 
                    </button>
                 </p>
       </form>
    </div>
  )
}

export default Login
