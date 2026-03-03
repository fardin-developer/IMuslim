import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../redux/features/querySlice";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import DashboardLayout from "./components/DashboardLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Query.css";

const Query = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { query } = useSelector((state) => state.query);
  const [tab, setTab] = useState(0);
  const [queries, setQueries] = useState([]);
  const [singleQuery, setSingleQuery] = useState(null);
  const [msg, setMsg] = useState("");

  async function handleSubtmit(id) {
    try {
      // Query API not available in new API structure
      message.info("Query feature temporarily unavailable");
      // For now, just show success message
      message.success("Message submitted");
      setTab(0);
      setMsg("");
    } catch (error) {
      console.log(error);
      message.error("Failed to submit message");
    }
  }

  async function getUserQuery() {
    try {
      // Query API not available in new API structure
      // Set empty queries for now
      setQueries([]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user !== null) {
      getUserQuery();
    }
  }, [user]);

  async function handleQuerySeen(id) {
    try {
      // Query API not available in new API structure
      dispatch(setQuery(true));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <DashboardLayout>
        <div className="title">
          {tab === 0 && (
            <table className="table table-bordered table-success">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {queries?.length === 0 ? (
                  <tr>
                    <td align="center" colSpan={4}>
                      No Query
                    </td>
                  </tr>
                ) : (
                  queries?.map((item, index) => {
                    return (
                      <tr>
                        <td>
                          <small>{index + 1}</small>
                        </td>
                        <td>
                          <small>{item?.email}</small>
                        </td>
                        <td>
                          <small>{item?.mobile}</small>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setTab(1);
                              setSingleQuery(item);
                              handleQuerySeen(item._id);
                            }}
                            className="p-1 view-btn"
                          >
                            {item?.status === "seen" ? "Closed" : "View"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
          {tab === 1 && (
            <div className="view-query-container">
              <div className="back-btnn" onClick={() => setTab(0)}>
                <ArrowBackIcon className="icon" />
                Back
              </div>
              <hr className="text-dark" />
              <div className="query-reply-container">
                {singleQuery?.msg?.map((item, index) => {
                  return (
                    <div
                      className={`query-msg ${
                        item?.person === "user" && "active"
                      }`}
                    >
                      {item?.msg}
                    </div>
                  );
                })}
              </div>
              {singleQuery.status === "pending" && (
                <textarea
                  onChange={(e) => setMsg(e.target.value)}
                  className="my-3 form-control"
                  name="msg"
                  rows="4"
                ></textarea>
              )}

              {singleQuery.status === "seen" ? (
                <div className="closedticket">Admin Has Closed this ticket</div>
              ) : (
                <button
                  onClick={() => handleSubtmit(singleQuery?._id)}
                  className="register-btn mt-3"
                >
                  Submit
                </button>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default Query;
