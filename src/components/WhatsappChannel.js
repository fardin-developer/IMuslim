import IMAGES from "../img/image";
import "./WhatsappChannel.css";

const WhatsappChannel = () => {
  return (
    <div className="whatsappchannel">
      <div
        className="whatsapplink"
        onClick={() =>
          window.open("https://whatsapp.com/channel/0029Vb9Vxvp4IBhNV9xatm2L")
        }
      >
        <div className="image">
          <img src={IMAGES.wa} alt="" />
        </div>
        <div className="msg">
          <p>Join our whatsapp channel!</p>
          <h6>
            Stay updated for weekly pass giveaways, offers and updates! Join now
          </h6>
        </div>
      </div>
    </div>
  );
};

export default WhatsappChannel;
