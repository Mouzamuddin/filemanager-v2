
const ListFiles = ({files}) => {

  const handleDownload = async(filePath) => {
      window.open(filePath, "_self");
  };

  return (
    <>
      <h1>Files</h1>
      <ul>
        {files.map((file, index) => {
          return (
            <div key={index}>
              <li>{file.filename}</li>
              <button onClick={() => handleDownload(file.path)}>
                Download
              </button>
            </div>
          );
        })}
      </ul>
    </>
  );
};

export default ListFiles;
