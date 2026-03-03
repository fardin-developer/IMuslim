import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";

const SearchForm = ({ user, filter, setFilter, showFilter, setShowFilter }) => {
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
        {/* <h6>Refine Search</h6> */}
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                To Age
              </label>
              <select
                name="fromAge"
                onChange={handleChange}
                value={filter?.fromAge}
                className="form-select"
              >
                <option value="">From Age</option>
                {AgeOptions}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                To Age
              </label>
              <select
                name="toAge"
                onChange={handleChange}
                value={filter?.toAge}
                className="form-select mt-2"
              >
                <option value="">To Age</option>
                {AgeOptions}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                Marital Status
              </label>
              <select
                value={filter?.maritalStatus}
                onChange={handleChange}
                name="maritalStatus"
                className="form-select"
              >
                <option value="Select">Select</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Awaiting Divorce">Awaiting Divorce</option>
                <option value="Anulled">Anulled</option>
              </select>
            </div>
          </div>{" "}
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                Education
              </label>
              <select
                name="qualification"
                value={filter?.qualification}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Select">Select</option>
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
          </div>{" "}
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                Mother Tongue
              </label>
              <select
                name="language"
                value={filter?.language}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Select">Select</option>
                <option value="Arabic">Hindi</option>
                <option value="Urdu">Urdu</option>
                <option value="Arabic">Arabic</option>
                <option value="Awadhi">Awadhi</option>
                <option value="Bengali">Bengali</option>
                <option value="Gujrati">Gujrati</option>
                <option value="Harynavi">Harynavi</option>
                <option value="Kannada">Kannada</option>
                <option value="Kashmiri">Kashmiri</option>
                <option value="Khandesi">Khandesi</option>
                <option value="Malyalam">Malyalam</option>
                <option value="Manipuri">Manipuri</option>
                <option value="Marathi">Marathi</option>
                <option value="Marwari">Marwari</option>
                <option value="Rajasthani">Rajasthani</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>{" "}
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                Community
              </label>
              <select
                name="community"
                value={filter?.community}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Select">Select</option>
                <option value="Ansari">Ansari</option>
                <option value="Awan">Awan</option>
                <option value="Bengali">Bengali</option>
                <option value="Dawoodi Bohra">Dawoodi Bohra</option>
                <option value="Dekkani">Dekkani</option>
                <option value="Dudekula">Dudekula</option>
                <option value="Jat">Jat</option>
                <option value="Khoja">Khoja</option>
                <option value="Lebbai">Lebbai</option>
                <option value="Mapila">Mapila</option>
                <option value="Maraicar">Maraicar</option>
                <option value="Memon">Memon</option>
                <option value="Mughal">Mughal</option>
                <option value="Pathan">Pathan</option>
                <option value="Qureshi">Qureshi</option>
                <option value="Rajput">Rajput</option>
                <option value="Rowther">Rowther</option>
                <option value="Shafi">Shafi</option>
                <option value="Sheikh">Sheikh</option>
                <option value="Shia">Shia</option>
                <option value="Shia Bohra">Shia Bohra</option>
                <option value="Shia Imam Ismaili">Shia Imam Ismaili</option>
                <option value="Shia Ithna Ashariyyah">
                  Shia Ithna Ashariyyah
                </option>
                <option value="Shia Zaidi">Shia Zaidi</option>
                <option value="Siddiqui">Siddiqui</option>
                <option value="Sunni">Sunni</option>
                <option value="Sunni Ehle-Hadith">Sunni Ehle-Hadith</option>
                <option value="Sunni Hanafi">Sunni Hanafi</option>
                <option value="Sunni Hunbali">Sunni Hunbali</option>
                <option value="Sunni Maliki">Sunni Maliki</option>
                <option value="Sunni Shafi">Sunni Shafi</option>
                <option value="Syed">Syed</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                State
              </label>
              <input
                className="form-control"
                list="state"
                type="text"
                name="state"
                placeholder="Enter State"
                onChange={handleChange}
                value={filter?.state}
              />
              <datalist name="state" id="state">
                {state?.map((item, i) => {
                  return (
                    <option key={i} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </datalist>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-fields mb-3">
              <label htmlFor="age" className="form-label">
                City
              </label>
              <input
                className="form-control"
                list="city"
                type="text"
                name="city"
                placeholder="Enter City"
                onChange={handleChange}
                value={filter?.city}
              />
              <datalist name="city" id="city">
                {cities?.map((item, i) => {
                  return (
                    <option key={i} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </datalist>
            </div>
          </div>
        </div>

        {/* <div className="filter-fields">
              <div className="fields">
                <small>Photo Settings</small>
              </div>
              <div className="options">
                <select name="maritalStatus" id="">
                  <option value="Never Married">Never Married</option>
                </select>
              </div>
            </div> */}
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

export default SearchForm;
