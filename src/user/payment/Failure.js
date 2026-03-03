import React, { useEffect, useState } from 'react';
import "./payment.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const Failure = () => {
  const params  = useParams();
  const data = params.id.split('_');

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Start a countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to /dashboard after 10 seconds
    const redirectTimer = setTimeout(() => {
      clearInterval(timer); // Clear the countdown timer
      navigate("/activate");
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
              <div className="payment-failed-icon">
                  <FaExclamationCircle />
              </div>
              <h3 className='m-0 text-danger'>{data[0] === 'failure' && 'Payment failed!'}</h3>
              <hr className='m-0 my-2'/>
          </div>
          <div className="w-100 px-3 text-center">
              <p className='w-50 txt-lg w-100 m-0'><strong>Dont't worry your money is safe!</strong> If your money was debited from your account, it will be refunded automatically in 5-7 working days.</p>       
          </div>
          <div className="w-100 px-3 mb-2 d-flex flex-wrap justify-content-center align-items-center">
          <table className='w-100 table border mt-4'>
              <tbody>
                  <tr>
                      <td className='txt-lg'><strong>Amout</strong></td>
                      <td className='txt-lg'>{data[9]} Rs</td>
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
                      <td className='txt-lg'><strong>Time</strong></td>
                      <td className='txt-lg'>{data[5]}</td>
                  </tr>
                  <tr>
                      <td className='txt-lg'><strong>Plan</strong></td>
                      <td className='txt-lg'>{data[7]}</td>
                  </tr>
              </tbody>
          </table>
        </div>
        <div className="w-100 px-3 text-center mb-5 mt-3 text-white">
              <p className='w-50 txt-lg w-100 m-0 bg-danger py-2'>{data[8]}</p>       
        </div>

        <div className='text-center mb-5'>
            <span className='text-center'>Redirecting to Dashboard in</span> <br />
            <h3 className='text-success mt-3 text-large'><strong>{countdown} Seconds</strong></h3>
        </div>
        <div className='d-flex flex-column justify-content-center align-items-center m-0'>
            <Link className='m-0 txt-sm' to={`/activate`}>
                <i className="fa-solid fa-arrow-left pe-2"></i>
                Go back to Activation page
            </Link>
        </div>
      </div>
      </>
      }
    </div>
  )
}

export default Failure