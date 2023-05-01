import axios from "axios";

const ListFiles = ({requestData, files,jwt}) => {

  // const handleDownload = async(filePath) => {
  //     window.open(filePath, "_self");
  // };

  const handleDownload = async(event,fileName) => {
    try {
      const response = await axios.get(`http://localhost:5001/download/${fileName}`, {
        withCredentials: true,
        responseType:'blob',
        headers: {
          "Access-Control-Allow-Origin": "*",
          authorization: jwt,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
      if (response.status === 200) {
       
      } else {
        throw new Error("authentication has been failed!");
      }
    } catch (err) {
      console.log(err);
    }
  ;
};
  const handleDelete = async(event,fileName) => {
    try {
        const response = await axios.delete(`http://localhost:5001/delete/${fileName}`, {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          authorization: jwt,
        },
      });
      
      // console.log(response)
      
      if (response.status === 200) {
      //  console.log(response)
       requestData();
      } else {
        throw new Error("authentication has been failed!");
      }
    } catch (err) {
      console.log(err);
    }
  ;
};

  return (
    <>
      <h1>Files</h1>
      <ul>
        {files.map((file, index) => {
          return (
            <div key={index}>
              <li>{file.filename}</li>
              <button onClick={(event) => handleDownload(event,file.filename)}>
                Download
              </button>
              <button onClick={(event) => handleDelete(event,file.filename)}>
                Delete
              </button>
            </div>
          );
        })}
      </ul>
    </>
  );
};

export default ListFiles;
