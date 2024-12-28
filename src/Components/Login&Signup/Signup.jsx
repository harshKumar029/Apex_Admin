import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Import Firebase configuration
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Apexlogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import CardImg from '../../assets/img/CardImg.svg';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAcceptTerms(checked);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const generateUniqueID = async () => {
    let uniqueID;
    let exists = true;

    while (exists) {
      uniqueID = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a six-digit ID
      const userDoc = await db.collection('users').where('uniqueID', '==', uniqueID).get();
      exists = !userDoc.empty;
    }

    return uniqueID;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!acceptTerms) {
      setMessage({ type: 'error', text: 'You must accept the terms and conditions.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const uniqueID = await generateUniqueID();

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        fullname: formData.fullname,
        mobile: formData.mobile,
        email: formData.email,
        uid: user.uid,
        uniqueID: uniqueID,
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        role: 'user', // Admin role will be assigned manually later
        earnings: 0,
      });

      setMessage({ type: 'success', text: 'Account created! Please verify your email before logging in.' });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:bg-blue-primary bg-white flex h-[100vh]">
      <section className="pt-4 hidden md:block pb-8 px-14 space-y-3">
        <img className="w-36" src={Apexlogo} alt="ApexLogo" />
        <div className="text-white">
          <h1 className="text-[2.3rem] font-medium">
            Your <b className="font-extrabold">Financial Future</b> Starts Here
          </h1>
          <h3>Join our growing community of successful agents.</h3>
          <img className="absolute w-[32rem] left-0 bottom-20" src={CardImg} alt="CardImg" />
        </div>
      </section>
      <section className="w-[120vw] h-screen mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
        <div className="md:w-[45vw] w-[90vw] px-5 md:mr-28 space-y-14 md:space-y-7">
          <div className="flex justify-between">
            <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">Create Account</h2>
            <img className="md:hidden block w-36" src={Apexlogoblue} alt="ApexLogo" />
          </div>

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
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] placeholder-[#495057] placeholder:font-medium focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] placeholder-[#495057] placeholder:font-medium focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] placeholder-[#495057] placeholder:font-medium focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] placeholder-[#495057] placeholder:font-medium focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={acceptTerms}
                onChange={handleChange}
                required
                className="mr-2"
              />
              <label className="text-[#495057]">
                I accept the{' '}
                <a
                  href="https://apexin.in/terms-conditions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#063E50] hover:underline"
                >
                  terms and conditions
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#053748] transition-colors"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A1A1A1]">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-[#063E50] cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;