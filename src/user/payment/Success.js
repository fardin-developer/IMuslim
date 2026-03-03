import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  const params  = useParams();
  const data = params.id.split('_');

  useEffect(() => {
    // Start a countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to /dashboard after 10 seconds
    const redirectTimer = setTimeout(() => {
      clearInterval(timer); // Clear the countdown timer
      navigate("/dashboard");
    }, 10000);

    // Clean up timers when the component unmounts
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className='d-flex flex-column align-items-center justify-content-center Mon_font mt-2'> 
      {data && 
      <>
      <div className='d-flex flex-column align-items-center justify-content-center'>
          <div className='my-1 pt-2 text-center'>
              <div className="payment-success-icon">
                  <AiOutlineCheckCircle />
              </div>
              <h3 className='m-0 text-success'>{data[0] === 'success' && 'Payment successfull!'}</h3>
              <hr className='m-0 my-2'/>
          </div>
          <div className="w-100 px-3 text-center mb-2 py-2">
            <p className='w-50 txt-lg w-100 m-0 text-success'>Your booking is successfull. We have sent you an email about the plan details. One of our team member will contact you soon.</p>
          </div>
          <div className="w-100 px-3 mb-2 d-flex flex-wrap justify-content-center align-items-center">
          <table className='w-100 table border mt-4'>
              <tbody>
                  <tr>
                      <td className='txt-lg'><strong>Name</strong></td>
                      <td className='txt-lg'>{data[2]}</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Email</strong></td>
                      <td className='txt-lg'>{data[3]}</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Amount</strong></td>
                      <td className='txt-lg'>{data[9]}Rs</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Payment Id</strong></td>
                      <td className='txt-lg'>{data[4]}</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Txn Id</strong></td>
                      <td className='txt-lg'>{data[1]}</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Paid to</strong></td>
                      <td className='txt-lg'>{'Edyguru'}</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Paid on</strong></td>
                      <td className='txt-lg'>{data[5]}</td>
                  </tr>
              </tbody>
          </table>
        </div>
        <div className='text-center mb-5'>
            <span className='text-center'>Redirecting to Dashboard in</span> <br />
            <h3 className='text-success mt-3 text-large'><strong>{countdown} Seconds</strong></h3>
        </div>
        <div className='d-flex flex-column justify-content-center align-items-center m-0'>
            <Link className='m-0 txt-sm' to="/dashboard">
                <i className="fa-solid fa-arrow-left pe-2"></i>
                Go back to dashboard page
            </Link>
        </div>
      </div>
      </>
      }
    </div>
  )
}

export default Success