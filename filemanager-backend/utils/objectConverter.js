exports.fileResponse = (files) => {
    let filesResult = []
    files.forEach(file => {
        filesResult.push({
            filename: file.name,
            uploader: file.uploader,
            email: file.email,
        })
    });
    return filesResult
}