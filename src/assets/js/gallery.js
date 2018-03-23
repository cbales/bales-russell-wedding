
function createDropzone() {
    if ($('#myDropzone').length) {
        var myDropzone = new Dropzone('#myDropzone', {
            url: "/uploadImage"
        });
        Dropzone.options.myDropzone =  {
            paramName: "file",
            url: 'uploadImage',
            maxFilesize: 20
        }
    }

}
window.setTimeout(createDropzone,1000);