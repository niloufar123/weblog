document.getElementById("imageUpload").onclick=function () {
    let xhttp=new XMLHttpRequest();//cereate new AJAX request

    const imageStatus= document.getElementById(
        "imageStatus"
    )
    const selectedImage=document.getElementById("selectedImage");

    xhttp.onreadystatechange = function () {
       
            imageStatus.innerHTML = this.responseText;
       
    };
    

    xhttp.open("POST","/dashboard/image-upload");
    let formData=new FormData();
    if(selectedImage.files.length>0){

        formData.append("image",selectedImage.files[0])
    
        xhttp.send(formData)
    }else{
        imageStatus.innerHTML="please select an image"
    }
}



