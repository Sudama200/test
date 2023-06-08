import React, { useState } from "react";
import "./App.css";
import logo from './logo.svg'
const formValues = {
  first_name: { label: "First Name", value: "", error: "" },
  last_name: { abel: "Last Name", value: "", error: "" },
  email: { label: "Email", value: "", error: "" },
  dob: { label: "DOB", value: "", error: "" },
  c_address_s1: { label: "Street 1", value: "", error: "" },
  c_address_s2: { label: "Street 2", value: "", error: "" },
  p_address_s1: { label: "Permanent Street 1", value: "", error: "" },
  p_address_s2: { label: "Permanent Street 2", value: "", error: "" },
  // is_permanent_current_add: "0"
  document1: { label: "Document 1", value: "", error: "" },
};
const uploadFileArr = [
  {
    fileName: "",
    selectOptions: ["image", "pdf"],
    name: "document1",
  },
]

const App = () => {
  const [isTypeDate, setIsTypeDate] = useState(false)
  const [disablePermanent, setDisablePermanent] = useState(false)
  const [formData, setFormData] = useState(formValues);
  const [isSameAddress, setIsSameAddress] = useState(0);
  const [allFilesList, setAllFilesList] = useState(uploadFileArr);
  const [fileInfo, setFileInfo] = useState({
    document1: { fileName: "", fileType: "" },
  });
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "file") {
      if (
        !fileInfo[name]?.fileType ||
        !fileInfo[name]?.fileName?.trim()?.length
      ) {
        event.target.files = "";
        setFormData({
          ...formData,
          [name]: {
            value: "",
            error: "please enter file name and choose fileType",
          },
        });
        return;
      }

      handleFiles(event);
      return;
    }

    if (type === "checkbox") {
      setIsSameAddress(checked);

      if (checked) {
        setFormData({
          ...formData,
          p_address_s1: { value: formData.c_address_s1.value, error: "" },
          p_address_s2: { value: formData.c_address_s2.value, error: "" },
        });
        setDisablePermanent(true)
      } else {
        setFormData({
          ...formData,
          p_address_s1: { value: "", error: "Required" },
          p_address_s2: { value: "", error: "Required" },
        });
        setDisablePermanent(false)

      }
      return;
    }

    if (name === 'dob') {
      const selectedDate = new Date(event.target.value);
      const currentDate = new Date();
      const minDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
      if (selectedDate > minDate) {
        setFormData({ ...formData, [name]: { value, error: "You must be at least 18 years old." } });
      } else {
        setFormData({ ...formData, [name]: { value, error: "" } });
      }
      return;
    }
    if (name === "email") {
      let emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isEmail = emailReg.test(value);
      if (isEmail) {
        setFormData({ ...formData, [name]: { value, error: "" } });
      } else {
        setFormData({ ...formData, [name]: { value, error: "Invalid email" } });
      }
      return;
    }

    setFormData({ ...formData, [name]: { value, error: "" } });
  };

  const handleFiles = (event) => {
    const { name, files } = event.target;

    if (files?.length > 0) {
      if (files[0].type.toLowerCase().includes(fileInfo[name].fileType)) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          let b64Str = reader.result;
          setFormData({ ...formData, [name]: { value: b64Str, error: "" } });
        });
        reader.readAsDataURL(files[0]);
      } else {
        setFormData({
          ...formData,
          [name]: { value: "", error: "Invalid file type" },
        });
        // event.target.files = "";
      }
    } else {
      event.target.files = "";
      setFormData({
        ...formData,
        [name]: { value: "", error: "Invalid file type" },
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let formDataError = Object.values(formData).some(
      (item) => !item.value.trim()?.length
    );

    if (formDataError) {
      validate();
      return;
    }

    let isError = Object.values(formData).some(
      (item) => item.error.trim()?.length
    );

    if (isError) return;

    let param = {};

    for (let key in formData) {
      param[key] = formData[key].value;
    }

    fetch("http://localhost:3001/form", {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(param),
    });
  };

  const validate = () => {
    let copyFormData = { ...formData };
    let tempObj = {};
    for (let key in copyFormData) {
      let innerObj = { ...copyFormData[key] };
      if (!innerObj.value?.trim()?.length) {
        if (key === "p_address_s1" || key === "p_address_s2") {
          if (isSameAddress) {
            innerObj["error"] = "";
          } else {
            innerObj["error"] = "Required";
          }
        } else {
          innerObj["error"] = "Required";
        }
      }
      tempObj[key] = innerObj;
    }

    setFormData(tempObj);
  };

  const {
    first_name,
    last_name,
    email,
    dob,
    c_address_s1,
    c_address_s2,
    p_address_s1,
    p_address_s2,
  } = formData;

  return (
    <div className="pY40">
      <div className="container">
        <div className="heading">
          <img className="logo" src={logo} height='45px' alt='logo' />
          <h1>REACT JS MACHINE TEST</h1>
        </div>
        <hr className="line_break" />

        <form method="post" onSubmit={handleSubmit}>
          <div className="flex flex-wrap form-group">
            <div>
              <label htmlFor="first_name">
                First Name:<span>*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={first_name.value}
                onChange={handleChange}
                placeholder="Enter your first name here.."
              />
              <p className="error">{first_name.error}</p>
            </div>

            <div>
              <label htmlFor="last_name">Last Name:<span>*</span></label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={last_name.value}
                onChange={handleChange}
                placeholder="Enter your last name here.."

              />
              <p className="error">{last_name.error}</p>
            </div>

            <div>
              <label htmlFor="email">Email:<span>*</span></label>
              <input
                type="text"
                id="email"
                name="email"
                value={email.value}
                onChange={handleChange}
                placeholder="Ex: myname@example.com"

              />
              <p className="error">{email.error}</p>
            </div>
            <div>
              <label htmlFor="dob">Date of Birth:<span>*</span></label>
              <input
                type={isTypeDate ? 'date' : "text"}
                id="dob"
                name="dob"
                value={dob.value}
                onChange={handleChange}
                placeholder="Date of Birth"
                onFocus={() => setIsTypeDate(true)}
              />
              <p className="dob">(Min. age should be 18 years)</p>
              <p className="error">{dob.error}</p>
            </div>
            <div className="width-100">
              <div>
                <label htmlFor="Residential">Residential Address:</label>
              </div>
              <div className="flex flex-wrap form-group">
                <div>
                  <h6>Street 1<span className="error">*</span></h6>
                  <input
                    type="text"
                    id="Residential"
                    name="c_address_s1"
                    value={c_address_s1.value}
                    onChange={handleChange}
                  />
                  <p className="error">{c_address_s1.error}</p>
                </div>

                <div>
                  <h6>Street 2<span className="error">*</span></h6>
                  <input
                    type="text"
                    id="Residential"
                    name="c_address_s2"
                    value={c_address_s2.value}
                    onChange={handleChange}

                  />
                  <p className="error">{c_address_s2.error}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt20">
            <div className="flex item-center address-select">
              <input
                type="checkbox"
                id="address"
                name="address"
                onChange={handleChange}
                checked={isSameAddress}
              />
              <label htmlFor="address"> Same as Residence Address</label>
            </div>

            <div className="width-100 ">
              <div>
                <label htmlFor="Residential">Permanent Address:</label>
              </div>
              <div className="flex flex-wrap form-group">
                <div>
                  <h6>Street 1</h6>
                  <input
                    type="text"
                    id="Residential"
                    name="p_address_s1"
                    value={p_address_s1.value}
                    onChange={handleChange}
                    disabled={disablePermanent ? true : false}
                  />
                  <p className="error">{p_address_s1.error}</p>
                </div>

                <div>
                  <h6>Street 2</h6>
                  <input
                    type="text"
                    id="Residential"
                    name="p_address_s2"
                    value={p_address_s2.value}
                    onChange={handleChange}

                  />
                  <p className="error">{p_address_s2.error}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt20">
            <div className="width-100 ">
              <div>
                <label htmlFor="Residential" className="bold-text">Upload Documents</label>
              </div>
              <div className="row">
                {allFilesList?.map((d, i) => {
                  return (
                    <div
                      className="flex flex-wrap form-group-three  col-gap-20 row"
                      key={i}
                    >
                      <div>
                        <label>
                          <h6> File Name<span className="error">*</span></h6>
                        </label>
                        <input
                          type="text"
                          value={fileInfo?.fileName}
                          onChange={(event) => {
                            setFileInfo({
                              ...fileInfo,
                              [d.name]: {
                                ...fileInfo[d.name],
                                fileName: event.target.value,
                              },
                            });
                          }}
                        ></input>
                      </div>

                      <div>
                        <label>
                          <h6> Type of file<span className="error">*</span></h6>
                        </label>
                        <select
                          onChange={(event) => {
                            setFileInfo({
                              ...fileInfo,
                              [d.name]: {
                                ...fileInfo[d.name],
                                fileType: event.target.value,
                              },
                            });
                          }}
                        >
                          <option value="" key={"kl"} disabled selected>
                            Select
                          </option>
                          {d.selectOptions?.map((dd, ind) => (
                            <option
                              value={dd}
                              key={ind}
                              selected={fileInfo[d.name].fileType === dd}
                            >
                              {dd}
                            </option>
                          ))}
                        </select>
                        <p className="dob">(image, pdf.)</p>
                      </div>

                      <div>
                        <label>
                          Upload Document <span>*</span>
                        </label>
                        <div className="input-upload">
                          <input
                            type="file"
                            name={d.name}
                            disabled={
                              !fileInfo[d.name]?.fileType ||
                              !fileInfo[d.name]?.fileName?.trim()?.length
                            }
                            onChange={handleChange}
                          ></input>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            let copyFilesList = [...allFilesList];
                            let copyFileInfo = { ...fileInfo };
                            let copyFormData = { ...formData };

                            if (i === 0) {
                              copyFilesList.push({
                                fileName: "",
                                selectOptions: ["image", "pdf"],
                                name: "document2",
                              });

                              copyFileInfo["document2"] = {
                                fileName: "",
                                fileType: "",
                              };
                              copyFormData["document2"] = { value: "", error: "" }
                              setAllFilesList(copyFilesList);
                              setFileInfo(copyFileInfo);
                              setFormData(copyFormData);
                              return;
                            }
                            delete copyFileInfo["document2"];
                            delete copyFormData["document2"];
                            setAllFilesList(
                              copyFilesList.filter((item, index) => index < 1)
                            );
                            setFormData(copyFormData)
                            setFileInfo(copyFileInfo);
                          }}
                        >
                          <i
                            className={i === 0 ? "fa fa-plus" : "fa fa-trash"}
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>

                      <p className="error">{formData[d.name]?.error}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button className="submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
