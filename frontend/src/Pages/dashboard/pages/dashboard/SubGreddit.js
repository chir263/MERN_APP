import Subs from "../../components/subs/Subgreddits";
import profilePic from "../../../../media/login/download.png";
import "./css/profile.css";

const SubGreddits = () => {
  return (
    <>
      <div className="profileRight">
        <div className="profileRightTop">
          <div className="profileCover">
            <img
              className="profileCoverImg"
              src="https://images6.alphacoders.com/112/1128590.jpg"
              alt=""
            />

            <img className="profileUserImg" src={profilePic} alt="" />
          </div>
          <br></br>
          <div className="profileInfo">
            <h4 className="profileInfoName">SubGreddits</h4>
          </div>
        </div>
        <div className="profileRightBottom">
          <Subs />
        </div>
      </div>
    </>
  );
};

export default SubGreddits;
