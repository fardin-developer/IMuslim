import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";

const FilterForm = ({ user, filter, setFilter, showFilter, setShowFilter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  let countryData = Country.getAllCountries();
  const [state, setState] = useState(null);
  const [cities, setCities] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  // Age
  const AgeOptions = [];
  for (let i = 18; i <= 70; i++) {
    AgeOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  // Country State City
  useEffect(() => {
    const selectedCountry = countryData.filter(
      (item) => item.name === user?.country
    );
    const stateData = State.getAllStates().filter(
      (item) => item?.countryCode === selectedCountry[0]?.isoCode
    );
    setState(stateData);
  }, [filter.country]);

  // get city
  useEffect(() => {
    const selectedState = State.getAllStates().filter(
      (item) => item.name === filter?.state
    );
    const cityData = City.getAllCities().filter(
      (item) => item.stateCode === selectedState[0]?.isoCode
    );
    setCities(cityData);
  }, [filter.state]);

  return (
    <div className="filter-form">
      <form className="form m-0" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Marital Status
              </label>
              <select
                onChange={handleChange}
                value={filter?.maritalStatus}
                className="form-select"
                name="maritalStatus"
              >
                <option value="Select">Select</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Awaiting Divorce">Awaiting Divorce</option>
                <option value="Anulled">Anulled</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                From Age
              </label>
              <select
                onChange={handleChange}
                value={filter?.fromAge}
                className="form-select"
                name="fromAge"
              >
                <option value="">Select From Age</option>
                {AgeOptions}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                To Age
              </label>
              <select
                onChange={handleChange}
                value={filter?.toAge}
                className="form-select"
                name="toAge"
              >
                <option value="">Select To Age</option>
                {AgeOptions}
              </select>
            </div>
          </div>
          {!location.pathname === "/near-me" && (
            <div className="col-12 col-sm-12 col-md-4 col-lg-4">
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  State
                </label>
                <select
                  onChange={handleChange}
                  value={filter?.state}
                  className="form-select"
                  name="state"
                >
                  <option value="">Select</option>
                  {state &&
                    state?.map((item) => {
                      return <option value={item?.name}>{item?.name}</option>;
                    })}
                </select>
              </div>
            </div>
          )}
          {!location.pathname === "/near-me" && (
            <div className="col-12 col-sm-12 col-md-4 col-lg-4">
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  City
                </label>
                <select
                  onChange={handleChange}
                  value={filter?.city}
                  className="form-select"
                  name="city"
                >
                  <option value="">Select</option>
                  {cities &&
                    cities?.map((item) => {
                      return <option value={item?.name}>{item?.name}</option>;
                    })}
                </select>
              </div>
            </div>
          )}
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Education
              </label>
              <select
                onChange={handleChange}
                value={filter?.qualification}
                className="form-select"
                name="qualification"
              >
                <option value="">Select</option>
                <option value="SSC">SSC</option>
                <option value="HSC">HSC</option>
                <option value="Under Graduate">Under Graduate</option>
                <option value="Graduated">Graduated</option>
                <option value="Post Graduation">Post Graduation</option>
                <option value="Doctorate">Doctorate</option>
                <option value="MBA">MBA</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Salary
              </label>
              <select
                onChange={handleChange}
                value={filter?.salary}
                name="salary"
                className="form-select"
              >
                <option value="Select">Select</option>
                <option value="Upto 1 Lakh">Upto 1 Lakh</option>
                <option value="1 to 2 Lakh">1 to 2 Lakh</option>
                <option value="2 to 4 Lakh">2 to 4 Lakh</option>
                <option value="4 to 7 Lakh">4 to 7 Lakh</option>
                <option value="7 to 10 Lakh">7 to 10 Lakh</option>
                <option value="10 to 15 Lakh">10 to 15 Lakh</option>
                <option value="15 to 20 Lakh">15 to 20 Lakh</option>
                <option value="More than 20 Lakh">More than 20 Lakh</option>
              </select>
            </div>
          </div> */}
        </div>
        <button
          type="submit"
          className="register-btn d-block m-auto"
          onClick={() => setShowFilter(!showFilter)}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default FilterForm;
