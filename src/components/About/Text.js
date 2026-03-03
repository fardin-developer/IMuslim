import React from "react";
import "./Text.css";

const Text = () => {
  return (
    <>
      <div className="container text-container border shadow p-3 pt-4 bg-white">
        <h3 className="mb-4" style={{ padding: "0 12px" }}>
          About Us
        </h3>
        <p className="text-muted container">
          Welcome to MyMuslimSaathi.com, where we believe that every individual
          deserves a loving and fulfilling partnership that aligns with their
          faith and values according to Islam.
          <hr className="m-0 my-2" />
        </p>
        <p className="text-muted container">
          At MyMuslimSaathi.com, we understand the significance of marriage in
          Islam and are dedicated to helping you find a compatible match for
          this sacred union. Our platform is tailored exclusively for those who
          are earnestly seeking a marriage partner who shares their faith,
          values, and life goals.
          <hr className="m-0 my-2" />
          With a steadfast commitment to upholding Islamic principles, we strive
          to provide a secure and confidential environment where you can connect
          with potential spouses. Our user-friendly interface and advanced
          matching algorithms are designed to simplify your search for a life
          partner.
          <hr className="m-0 my-2" />
          Join us today and take the first step towards building a blessed and
          fulfilling marital relationship that aligns with your beliefs and
          aspirations. Your journey to finding your Muslim life partner begins
          here.
        </p>
      </div>
      <div className="container text-container border shadow p-3 pt-4 mt-4 bg-white">
        <h3 className="mb-4" style={{ padding: "0 12px" }}>
          Our Mission
        </h3>
        <p className="text-muted container">
          At MyMuslimSaathi.com, our mission is to facilitate meaningful and
          lasting marriages within the Muslim community, guided by the
          principles of faith, respect, and compatibility. We are committed to
          providing a trusted and secure platform where individuals can find
          their ideal life partners who share their values, beliefs, and
          aspirations.
        </p>
        <hr className="m-0 my-2" />
        <p className="text-muted container">
          Join us in our mission to unite hearts in the spirit of faith, love,
          and companionship. Your journey towards a fulfilling and blessed
          marriage starts here.
        </p>
      </div>
      {/* <div className="container text-container border shadow p-3 pt-4 mt-4 bg-white">
        <h3 className="mb-4" style={{ padding: "0 12px" }}>
          What We Offer
        </h3>
        <p className="text-muted container">
          We offer a wide range of courses designed to cater to various
          interests and skill levels. Whether you're a beginner looking to
          acquire new skills or an experienced professional aiming to stay ahead
          in your field, we have something for you. Our courses cover topics
          such as WordPress, Digital Marketing, Personality Development etc.
          ensuring that there's always something exciting to learn.
        </p>
      </div> */}
      <div className="container text-container border shadow p-3 pt-4 mt-4 bg-white">
        <h3 className="mb-4" style={{ padding: "0 12px" }}>
          Why Choose Us?
        </h3>
        <p className=" container">
          <p>
            <strong>Privacy and Security: </strong>
            <span className="text-muted">
              Your safety and confidentiality are our top priorities. We employ
              advanced security measures to protect your personal information
              and provide a secure environment for your interactions.
            </span>
          </p>
          <p>
            <strong>Verified Profiles: </strong>
            <span className="text-muted">
              We offer optional profile verification to enhance trust and
              authenticity, giving you confidence in the legitimacy of the
              individuals you connect with.
            </span>
          </p>
          <p>
            <strong>Customized Matchmaking: </strong>
            <span className="text-muted">
              Our advanced algorithms take into account a wide range of factors,
              allowing us to provide you with highly compatible match
              suggestions based on your unique preferences.
            </span>
          </p>
          <p>
            <strong>Diverse User Base: </strong>
            <span className="text-muted">
              With a global reach, we attract a diverse community of Muslims
              from various backgrounds, cultures, and regions, broadening your
              options for finding a compatible partner.
            </span>
          </p>
          <p>
            <strong>Comprehensive Profiles: </strong>
            <span className="text-muted">
              Our detailed profiles give you a thorough understanding of
              potential matches, including their interests, values, and
              lifestyle, helping you make informed decisions.
            </span>
          </p>
          <p>
            <strong>User-Friendly Interface: </strong>
            <span className="text-muted">
              Our platform is designed with simplicity and intuitiveness in
              mind, ensuring that your experience is seamless and enjoyable.
            </span>
          </p>
          <p>
            <strong>Guidance and Resources: </strong>
            <span className="text-muted">
              We offer educational resources, relationship advice, and access to
              community forums, providing you with valuable insights and support
              throughout your journey.
            </span>
          </p>
          <p>
            <strong>Exceptional Customer Support: </strong>
            <span className="text-muted">
              Our dedicated customer support team is available to assist you
              with any questions or concerns, providing prompt and reliable
              assistance.
            </span>
          </p>
          <p>
            <strong>Success Stories: </strong>
            <span className="text-muted">
              We take pride in the successful unions that have been forged
              through our platform, and we look forward to helping you write
              your own love story.
            </span>
          </p>
        </p>
      </div>
      {/* <div className="container text-container border shadow p-3 pt-4 mt-4 bg-white">
        <h3 className="mb-4" style={{ padding: "0 12px" }}>
          Join Our Community
        </h3>
        <p className="text-muted container">
          We invite you to join our community of learners, where you can connect
          with like-minded individuals, ask questions, and share your knowledge.
          Learning is a journey, and we are here to support you every step of
          the way.
        </p>
      </div> */}
      <div className="container text-container border shadow p-3 pt-4 mt-4 bg-white">
        <h3 className="mb-4" style={{ padding: "0 12px" }}>
          Contact Us
        </h3>
        <p className="text-muted container">
          If you have any questions or need assistance, please don't hesitate to
          contact our friendly support team at{" "}
          <strong>hello@mymuslimsaathi.com</strong>. We are here to help you
          succeed.
        </p>
      </div>
    </>
  );
};

export default Text;
