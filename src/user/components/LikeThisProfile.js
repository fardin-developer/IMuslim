import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { authAPI } from "../../lib/api";
import { setUser } from "../../redux/features/userSlice";

const LikeThisProfile = ({ activeUser, data }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(0);
  const [showContactBtn, setShowContactBtn] = useState(false);
  const [upgardePopup, setUpgardePopup] = useState(false);
  const [contactAlert, setContactAlert] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [userContact, setUserContact] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);

  const checkContactData = () => {
    const findContactData = activeUser?.contactData.find(
      (item) => item.msId === params.id
    );
    setUserContact(findContactData?.contactNumber);
    if (findContactData) {
      setShowContact(true);
    }
  };

  const checkDeclineRequest = () => {
    const findDecline = activeUser?.deleted.find(
      (item) => item.msId === params.id
    );
    if (findDecline) {
      setShowDecline(true);
    }
  };
  const checkAcceptedRequest = () => {
    const findAccepted = activeUser?.accepted.find(
      (item) => item.msId === params.id
    );
    if (findAccepted) {
      setShowAccepted(true);
    }
  };

  const checkLike = () => {
    const findLike = activeUser?.likesData.find(
      (item) => item.msId === params.id
    );
    if (findLike) {
      setShowContactBtn(true);
    }
  };

  const handleContact = () => {
    if (parseInt(activeUser?.contacts) > 0) {
      setContactAlert(true);
    } else {
      setUpgardePopup(true);
    }
  };

  const handleLike = async () => {
    try {
      // User like API not available in new API structure
      message.info("Like feature temporarily unavailable");
      // For now, just refresh user data
      getUserData();
    } catch (error) {
      console.log(error);
      message.error("Failed to like profile");
    }
  };

  const handleSeeContact = async () => {
    try {
      // See contact API not available in new API structure
      message.info("Contact feature temporarily unavailable");
      // For now, just refresh user data
      getUserData();
    } catch (error) {
      console.log(error);
      message.error("Failed to see contact");
    }
  };

  const getUserData = async () => {
    try {
      const response = await authAPI.getUserInfo();
      const res = await response.json();
      if (res.success) {
        dispatch(setUser(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkContactData();
    checkLike();
    checkDeclineRequest();
    checkAcceptedRequest();
  }, [checkLike, checkContactData]);

  return (
    <div className="like-this-profile-container">
      {showContact ? (
        <div className="show-contact-container border">
          <span className="text-center text-white">
            <i>You can contact directly</i>
          </span>
          <Link to={`tel:${userContact}`}>
            <CallIcon className="icon call-btn" />
          </Link>
          <Link to={`https://wa.me/${userContact}`}>
            <WhatsAppIcon className="icon whatsapp-btn" />
          </Link>
        </div>
      ) : showContactBtn ? (
        <div className="border user-contact-container">
          {parseInt(activeUser?.contacts) <= 0 && (
            <span>
              <small>
                <Link to="/premium-plans">Upgrade</Link> to Contact
              </small>
            </span>
          )}
          <button className="call-btn" onClick={handleContact}>
            <CallIcon className="me-2 icon" />
            See Contact
          </button>
          <button className="whatsapp-btn" onClick={handleContact}>
            <WhatsAppIcon className="me-2 icon" />
            Whatsapp
          </button>
        </div>
      ) : showDecline ? (
        <div className="border text-center like-container col-12 col-sm-12 col-md-4 col-lg-4">
          <span>
            <CancelIcon className="icon text-danger" />
            <br />
            <small>User has Declined you</small>
          </span>
        </div>
      ) : showAccepted ? (
        <div
          onClick={() => navigate("/inbox-accepted")}
          className="border text-center like-container col-12 col-sm-12 col-md-4 col-lg-4"
        >
          <span>
            <CheckCircleIcon className="icon text-success" />
            <br />
            <small>Already Accepted</small>
          </span>
        </div>
      ) : (
        <div
          onClick={handleLike}
          className="border text-center like-container col-12 col-sm-12 col-md-4 col-lg-4"
        >
          <span>
            <small>Like this profile?</small>
          </span>
          <span>
            <CheckCircleIcon className="icon" />
            <br />
            <small>Connect Now</small>
          </span>
        </div>
      )}

      {/* Contact Upgrade Modal */}
      <div
        onClick={() => setUpgardePopup(!upgardePopup)}
        className={`contact-upgrade-modal ${upgardePopup && "active"}`}
      >
        <div className="upgrade-container">
          <span>
            <small>To Contact directly Upgrade Now</small>
          </span>
          <button onClick={() => navigate("/premium-plans")}>
            Upgrade Now
          </button>
        </div>
      </div>
      <div
        onClick={() => setContactAlert(!contactAlert)}
        className={`contact-upgrade-modal ${contactAlert && "active"}`}
      >
        <div className="upgrade-container">
          <span className="text-center">
            <small>Are you sure you want to see the Contact?</small>
          </span>
          <div className="d-flex">
            <button className="px-4" onClick={handleSeeContact}>
              Yes
            </button>
            <button
              className="px-4"
              onClick={() => setContactAlert(!contactAlert)}
            >
              No
            </button>
          </div>
          <span className="text-center">
            <small>
              After clicking on yes remaining Contacts will be{" "}
              {parseInt(activeUser?.contacts) - 1}
            </small>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LikeThisProfile;
