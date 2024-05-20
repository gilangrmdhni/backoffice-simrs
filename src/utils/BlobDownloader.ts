export const BlobConvertDownload = (xlsx :any, name  : string, withName = true) => {
    const blob = new Blob([xlsx], { type: 'text/xlsx' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    const currentTime = new Date();
    const time = currentTime.toISOString().replace(/[-T:.Z]/g, '');
    if (withName === true) {
        link.download = `${name}_${time}.xlsx`;
    }else{
        link.download = name;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}
