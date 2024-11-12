import { Uppload, Local, Instagram, xhrUploader, en, Crop } from "uppload";

const profilePicture = new Uppload({
    bind: document.querySelector("img.profile-pic"),
    call: document.querySelector("button.pic-btn"),
    lang: en,
    uploader: xhrUploader({
        endpoint: window.location.origin + '/api/user/avatar',
        fileKeyName: "image"
    }),
})

const errorLogger = (error) => {
    console.log("The error message is", error);
};
profilePicture.on("error", errorLogger); // Start listening

profilePicture.use([
    new Local({ maxFileSize: 6291456 }), // Select file from computer
    new Crop({ aspectRatio: 1 / 1 }), // Let users crop image to 1/1
    new Instagram(),
]);
