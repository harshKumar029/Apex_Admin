import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Import Firebase configuration
import ApexLogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import Google from '../../assets/icon/Google.svg';
import CardImg from '../../assets/img/CardImg.svg';

const Forgetpass = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);

      // Check the user role in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Ensure the user has the role "admin"
        if (userData.role === 'admin') {
          setMessage({ type: 'success', text: 'Successfully signed in with Google!' });
          setTimeout(() => navigate('/'), 1500); // Redirect to dashboard
        } else {
          setMessage({ type: 'error', text: 'Access denied. Only admins can sign in.' });
          auth.signOut(); // Sign out the user if they are not admin
        }
      } else {
        setMessage({ type: 'error', text: 'No user found with this account.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Google sign-in failed.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages

    try {
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', email));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Ensure the user has the role "admin"
        if (userData.role === 'admin') {
          // Send password reset email
          await sendPasswordResetEmail(auth, email);
          setMessage({ type: 'success', text: 'Password reset email sent successfully!' });
        } else {
          setMessage({ type: 'error', text: 'Access denied. Only admins can reset their password.' });
        }
      } else {
        setMessage({ type: 'error', text: 'No user found with this email.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while sending the password reset email.' });
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
            <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">Forgot Password</h2>
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
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 text-lg md:text-base font-semibold rounded-lg hover:bg-[#053748] transition-colors"
            >
              Send Password Reset Email
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
              <span onClick={() => navigate('/login')} className="text-[#063E50] cursor-pointer hover:underline">
                Sign in
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Forgetpass;