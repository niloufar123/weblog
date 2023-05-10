document.getElementById("imageUpload").onclick=function () {
    let xhttp=new XMLHttpRequest();//cereate new AJAX request

    const imageStatus= document.getElementById("imageStatus");
    const selectedImage=document.getElementById("selectedImage");
    const progressDev=document.getElementById("progressDev");
    const progressBar=document.getElementById("progressBar");
    const uploadResult=document.getElementById("uploadResult");


    xhttp.onreadystatechange = function () {
            if(xhttp.status==200){
                imageStatus.innerHTML = "upload image was successfuly";
                uploadResult.innerHTML = this.responseText;
                selectedImage.value="";//input image clear

            }else{

                imageStatus.innerHTML = this.responseText;
            }
       
    };
    

    xhttp.open("POST","/dashboard/image-upload");

    xhttp.upload.onprogress=function (e) {
        if(e.lengthComputable){
            let result=Math.floor((e.loaded/e.total)*100);
            if(result!=100){
                progressBar.innerHTML=result+"%";
                progressBar.style="width:"+result+"%"
            }else{
                progressDev.style="display: none"
            }

            console.log(e.loaded,'===>',result)
        }
    }
    let formData=new FormData();
    if(selectedImage.files.length>0){
        progressDev.style="display: block"


        formData.append("image",selectedImage.files[0])
    
        xhttp.send(formData)
    }else{
        imageStatus.innerHTML="please select an image"
    }
}



