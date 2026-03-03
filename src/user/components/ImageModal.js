import React from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "./ImageModal.css";

const ImageModal = ({
  data,
  imageModal,
  setImageModal,
  userImage,
  setUserImage,
}) => {
  return (
    <div className={`image-modal-container ${imageModal && "active"}`}>
      <div className="modal-black-bg">
        <div className="display-image">
          <img
            src={data?.images?.length > 0 ? data?.images[userImage] : ""}
            alt=""
          />
          {data?.images?.length <= 0 && (
            <span className="text-white">No Images Uploaded</span>
          )}
        </div>
        <div className="image-slides">
          {data?.images?.map((image, index) => {
            return (
              <img onClick={() => setUserImage(index)} src={image} alt="img" />
            );
          })}
        </div>
        <HighlightOffIcon
          onClick={() => setImageModal(!imageModal)}
          className="icon"
        />
      </div>
    </div>
  );
};

export default ImageModal;
