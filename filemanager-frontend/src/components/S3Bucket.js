import React,{useState, useEffect} from 'react'
import axios from "axios";
import UploadFiles from "./UploadFiles";
import ListFiles from "./ListFiles";

const S3Bucket = ({jwt}) => {

    const [files, setFiles] = useState([]);
    useEffect(()=>{
        requestData();
      },[])

    const requestData = async () => {
        try {
          const response = await axios.get("http://localhost:5001/files/list", {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              authorization: jwt,
            },
          });
            
          if (response.status === 200) {
            setFiles(response.data);
          } else {
            throw new Error("authentication has been failed!");
          }
        } catch (err) {
          console.log(err);
        }
      };
    
  return (<>
  <UploadFiles jwt={jwt} requestData={requestData} />
  <ListFiles files={files}/>
  </>
  )
}

export default S3Bucket