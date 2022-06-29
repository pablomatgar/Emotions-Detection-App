import React, { useEffect, useRef } from "react";
import { Page } from "framework7-react";

const HomePage = () => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);

  let recognizedEmotion = "Sad";

  useEffect(() => {
    if (isMobile()) {
      startCanvasCamera();
    } else {
      getBrowserCamera();
    }
  }, []);

  // ------------------------- Helper functions -------------------------
  const isAndroid = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return true;
    return false;
  };

  const isIos = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/i.test(userAgent)) return true;
    return false;
  };

  const isMobile = () => {
    if (window.cordova && (isAndroid() || isIos())) {
      return true;
    } else {
      return false;
    }
  };

  // ------------------------- Camera functions -------------------------
  // Desktop
  const getBrowserCamera = () =>
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: 224,
          height: 224,
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });

  // Mobile
  const readImageFile = (data) => {
    const protocol = "file://";
    let filepath = "";
    if (isAndroid()) {
      filepath = protocol + data.output.images.fullsize.file;
    } else {
      filepath = data.output.images.fullsize.file;
    }
    window.resolveLocalFileSystemURL(
      filepath,
      async (fileEntry) => {
        fileEntry.file(
          (file) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const blob = new Blob([new Uint8Array(reader.result)], {
                type: "image/png",
              });
              imageRef.value.src = window.URL.createObjectURL(blob);
            };
            reader.readAsArrayBuffer(file);
          },
          () => {}
        );
      },
      () => {}
    );
  };

  const startCanvasCamera = () => {
    const options = {
      canvas: {
        width: 224,
        height: 224,
      },
      capture: {
        width: 224,
        height: 224,
      },
      use: "file",
      fps: 30,
      hasThumbnail: false,
      cameraFacing: "front",
    };
    window.plugin.CanvasCamera.start(
      options,
      async () => {},
      (data) => {
        readImageFile(data);
      }
    );
  };

  return (
    <Page name='home' className='home-component'>
      <h2 className='title'>Emotions Recognition</h2>
      <p className='sub-title'>What emotions do you feel today?</p>

      {isMobile ? (
        <video className='capturing-video' ref={videoRef} autoPlay></video>
      ) : (
        <img
          className='capturing-img'
          // ref='imageRef'
          width='224'
          height='224'
          src='../static/placeholder.png'
        />
      )}

      <h2 className='recognized-title'>Recognized emotion:</h2>
      <p className='recognized-emotion'>{recognizedEmotion}</p>

      <p className='footer'>
        Created by <br /> Asial Corporation
      </p>
    </Page>
  );
};
export default HomePage;
