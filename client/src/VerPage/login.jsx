import { useRef, useState, useEffect} from 'react';
const LOGIN_URL = 'http://localhost:8080/auth';
import { Link } from "react-router-dom";
import './styles ver.css'

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST", 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, pwd }) 
        });

     
        if (!response.ok) {
            if (response.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (response.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();
            return; // Виходимо, щоб не виконувати код успіху
        }

        const result = await response.json();
        console.log(result);
        
       
        
        setUser('');
        setPwd('');
        setSuccess(true);
    } catch (err) {
        
        setErrMsg('No Server Response');
        errRef.current?.focus();
    }
}

    return (
        <>
            {success ? (
                <div>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="http://localhost:5173/Profile">Go to Home</a>
                    </p>
                </div>
            ) : (
                <div className='ver_scen'>
                <div className='ver_box'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit} className='label'> 
                        <label htmlFor="username" >Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />

                        <label htmlFor="password" >Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            
                            <a href="http://localhost:5173/SignUp">Sign Up</a>
                        </span>
                    </p>
                </div>
                </div>
            )}
        </>
    )
}

export default Login