import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Make sure to set up Firebase configuration in firebase.js
import ApexLogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import Google from '../../assets/icon/Google.svg';
import CardImg from '../../assets/img/CardImg.svg';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' }); // Type can be 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear any previous messages

    const { email, password } = formData;

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the user has the role "admin"
        if (userData.role === 'admin') {
          setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
          setTimeout(() => navigate('/'), 1500); // Redirect after 1.5 seconds
        } else {
          // Sign out the user if not admin
          auth.signOut();
          setMessage({ type: 'error', text: 'Access denied. Only admins can log in.' });
        }
      } else {
        setMessage({ type: 'error', text: 'User not found in the database.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during login.' });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Ensure the user has the role "admin"
        if (userData.role === 'admin') {
          setMessage({ type: 'success', text: 'Successfully signed in with Google!' });
          setTimeout(() => navigate('/'), 1500); // Redirect to dashboard
        } else {
          setMessage({ type: 'error', text: 'Access denied. Only admins can log in.' });
          auth.signOut(); // Sign out the user if they are not admin
        }
      } else {
        setMessage({ type: 'error', text: 'No user found with this Google account.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Google sign-in failed.' });
    }
  };

  return (
    <div className="md:bg-blue-primary bg-white flex h-[100vh]">
      <section className="pt-4 hidden md:block pb-8 px-14 space-y-3">
        <img className="w-36" src={ApexLogo} alt="ApexLogo" />
        <div className="text-white">
          <h1 className="text-[2.5rem] font-medium">
            Your <b className="font-extrabold">Financial Future</b> Starts Here
          </h1>
          <h3>Join our growing community of successful agents.</h3>
          <img className="absolute w-[32rem] left-0 bottom-20" src={CardImg} alt="CardImg" />
        </div>
      </section>
      <section className="w-[120vw] h-screen mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
        <div className="md:w-[45vw] w-[90vw] px-5 md:mr-28 space-y-14 md:space-y-7">
          <div className="flex justify-between">
            <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">LogIn to your Account</h2>
            <img className="md:hidden block w-36" src={Apexlogoblue} alt="ApexLogo" />
          </div>

          {/* Message Section */}
          {message.text && (
            <p
              className={`text-center py-2 rounded-lg text-sm mb-2 ${
                message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="mb-6">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex justify-end">
              <p onClick={() => navigate('/password/reset')} className="cursor-pointer font-medium text-[#063E50]">
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 text-lg md:text-base font-semibold rounded-lg hover:bg-[#053748] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <p className="text-[#ADB5BD] font-medium">- OR -</p>
          </div>

          {/* Google Button */}
          <div className="mt-6 flex">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center gap-3 font-semibold items-center bg-gray-100 hover:bg-gray-200 py-3 rounded-lg shadow transition-all"
            >
              <img src={Google} alt="Google" />
              <span className="text-gray-700">Continue with Google</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#A1A1A1] flex justify-center">
              Already have an account?{' '}
              <span onClick={() => navigate('/signup')} className="text-[#063E50] cursor-pointer hover:underline">
                Signup
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;