import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import { otherAPI } from "../lib/api";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import "./Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await otherAPI.getLeaderboard();
      const res = await response.json();
      if (res.success) {
        const leaderboardData = res.data || [];
        const updatedData = leaderboardData.map((item) => {
          let name = item?.fname || item?.name || "User";
          if (name.includes("@gmail.com")) {
            name = name.replace("@gmail.com", "");
          }
          return {
            ...item,
            name: name,
            score: item?.totalSpent || item?.score || 0,
          };
        });
        setData(updatedData);
      } else {
        message.error(res.message || "Failed to load leaderboard");
      }
    } catch (error) {
      console.log(error.message);
      message.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  const topThree = data.slice(0, 3);
  const remaining = data.slice(3);

  const getProfileInitial = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getProfileImage = (item) => {
    return item?.profileImage || item?.avatar || null;
  };

  return (
    <Layout>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </button>
          <h2 className="leaderboard-title">Leaderboards</h2>
        </div>

        {loading ? (
          <div className="leaderboard-loading">
            <p>Loading leaderboard...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No records found</p>
          </div>
        ) : (
          <>
            {/* Top 3 Players */}
            {topThree.length > 0 && (
              <div className="top-three-container">
                {/* 2nd Place - Left */}
                {topThree[1] && (
                  <div className="top-player-card second">
                    <div className="top-player-rank">2</div>
                    <div className="top-player-crown">
                      <EmojiEventsIcon />
                    </div>
                    <div className="top-player-avatar">
                      {getProfileImage(topThree[1]) ? (
                        <img src={getProfileImage(topThree[1])} alt={topThree[1].name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {getProfileInitial(topThree[1].name)}
                        </div>
                      )}
                    </div>
                    <div className="top-player-name">{topThree[1].name}</div>
                    <div className="top-player-score">₹{parseFloat(topThree[1].score || 0).toFixed(2)}</div>
                  </div>
                )}
                {/* 1st Place - Center (Highest) */}
                {topThree[0] && (
                  <div className="top-player-card first">
                    <div className="top-player-rank">1</div>
                    <div className="top-player-crown">
                      <EmojiEventsIcon />
                    </div>
                    <div className="top-player-avatar">
                      {getProfileImage(topThree[0]) ? (
                        <img src={getProfileImage(topThree[0])} alt={topThree[0].name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {getProfileInitial(topThree[0].name)}
                        </div>
                      )}
                    </div>
                    <div className="top-player-name">{topThree[0].name}</div>
                    <div className="top-player-score">₹{parseFloat(topThree[0].score || 0).toFixed(2)}</div>
                  </div>
                )}
                {/* 3rd Place - Right */}
                {topThree[2] && (
                  <div className="top-player-card third">
                    <div className="top-player-rank">3</div>
                    <div className="top-player-crown">
                      <EmojiEventsIcon />
                    </div>
                    <div className="top-player-avatar">
                      {getProfileImage(topThree[2]) ? (
                        <img src={getProfileImage(topThree[2])} alt={topThree[2].name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {getProfileInitial(topThree[2].name)}
                        </div>
                      )}
                    </div>
                    <div className="top-player-name">{topThree[2].name}</div>
                    <div className="top-player-score">₹{parseFloat(topThree[2].score || 0).toFixed(2)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Remaining Players List */}
            {remaining.length > 0 && (
              <div className="leaderboard-list">
                {remaining.map((item, index) => {
                  const rank = index + 4;
                  return (
                    <div key={index} className="leaderboard-item">
                      <div className="item-rank">{rank}</div>
                      <div className="item-avatar">
                        {getProfileImage(item) ? (
                          <img src={getProfileImage(item)} alt={item.name} />
                        ) : (
                          <div className="avatar-placeholder small">
                            {getProfileInitial(item.name)}
                          </div>
                        )}
                      </div>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-score">₹{parseFloat(item.score || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Leaderboard;
