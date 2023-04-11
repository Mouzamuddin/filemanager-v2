import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadFiles = ({ jwt, requestData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sucessMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    
    let formData = new FormData();
    formData.append("file", selectedFile);
    console.log(selectedFile);

    if (selectedFile) {
      try {
        const response = await axios.post(
          "http://localhost:5001/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: jwt,
            },
          }
        );
        if (response.status === 200) {
          requestData();
          setSucessMessage("File uploaded successfully");
        }
      } catch {
        console.log("Error in upload");
      }
    } else {
      setErrorMessage("Please select the file");
    }
  };

  return (
    <div>
      <form
        method="post"
        action="#"
      >
        <input type="file" name="uploadfile" onChange={onChange}></input>
        <p> {sucessMessage}</p>
        <p>{errorMessage}</p>
        <button
          onClick={(e) => {
            uploadFile(e);
          }}
        >
          {" "}
          upload{" "}
        </button>
      </form>
    </div>
  );
};

export default UploadFiles;
