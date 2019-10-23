import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import Cropper from "cropperjs";
import { HttpClient } from '@angular/common/http';
import { ImageDetails } from "./image-details"

@Component({
    selector: 'image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

    @ViewChild("image", { static: false })
    public imageElement: ElementRef;
    public croppedImageName:string="hi";
    public imageSource: string;

    public imgWidth: number;
    public imgHeight: number;

    public imageDestination: string;
    public base64: string;
    private cropper: Cropper;

    imageList: any[];
    pdfImagesUrl: any[];
    formData = new FormData();

    //My additions
    imageDetails:ImageDetails;
    imageDetailsList:ImageDetails[] = [];

    public constructor(
              private http : HttpClient
    ) {
        // this.imageDestination = "";
        // this.imageSource = "assets/angular.png";
        //this.pdfImagesUrl = ["assets/angular.png","C:/Images/AmeriHome 1/AmeriHome 11"];
        //this.imageSource = "C:/Images";
    }

    ngOnInit() { 
        this.imageDestination = "";
        this.imageSource = "assets/angular.png";
        this.imageDetails = {ImageName : "", ImageDataURL : "", ImgH:0, ImgW:0}
    }

    public ngAfterViewInit() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            zoomable: false,
            scalable: false,
            aspectRatio: 0,
            autoCrop:false,
            autoCropArea: 0.0,
            crop: () => {
                const canvas = this.cropper.getCroppedCanvas();
                this.imgWidth = canvas.width;
                this.imgHeight = canvas.height;
                this.imageDestination = canvas.toDataURL("image/png");
                // console.log(this.imageDestination);
            }
        });
    }

    public convToJPG(imageDetails:ImageDetails)
    {

      const imageName = imageDetails.ImageName +'.jpg';
      // call method that creates a blob from dataUri
      const imageBlob = this.dataURItoBlob(imageDetails.ImageDataURL);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

      this.formData.append("File",imageFile);

    }

    addtoImgList(){
        this.imageDetails.ImageDataURL = this.imageDestination;
        this.imageDetails.ImgH = this.imgHeight;
        this.imageDetails.ImgW = this.imgWidth;
        this.imageDetailsList.push(this.imageDetails);
        this.imageDetails = {ImageName : "", ImageDataURL : "", ImgH:0, ImgW:0};
        this.cropper.reset();
    }


    uploadTemplates(){
        if (this.imageDetailsList.length === 0) {
            return;
          }
        
        this.imageDetailsList.forEach(element => { this.convToJPG(element);
            
        });
        this.http.post<any>("http://localhost:22528/api/Upload/user/PostUserImage", this.formData).subscribe(
        (data: any) => { 
      }
    ); 
         
    }


    public dataURItoBlob(dataURI) 
    {
      this.base64 = dataURI.substr(22);
      const byteString = window.atob(this.base64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });    
      return blob;
   }

    

}

