import React, { useEffect, useRef, useState } from "react";
import { Page } from "framework7-react";
// import * as faceapi from "face-api.js";
import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";

const HomePage = () => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [detectedEmotion, setDetectedEmotion] = useState("Loading...");
  const MODEL_URL = "models";

  const loadModel = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  useEffect(async () => {
    await loadModel();
    startVideo();
  }, []);

  const startVideo = () => {
    if (isMobile()) {
      startCanvasCamera();
      predictEmotion(imageRef.current);
    } else {
      getBrowserCamera();
      predictEmotion(videoRef.current);
    }
  };

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

  const predictEmotion = async (stream) => {
    setInterval(async () => {
      const detectionWithExpressions = await faceapi
        .detectSingleFace(stream)
        .withFaceExpressions();

      try {
        setDetectedEmotion(
          Object.entries(detectionWithExpressions.expressions).filter((key) => {
            key[0] = (key[0] + ' ').toUpperCase();
            key[1] = Math.trunc(key[1] * 100);
            return key[1] > 90;
          })
        );
      } catch (error) {
        console.log("No face found");
      }
    }, 2000);
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
      .then(async (stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });

  // Mobile
  const readImageFile = (data) => {
    // set file protocol
    const protocol = "file://";
    let filepath = "";
    if (isAndroid()) {
      filepath = protocol + data.output.images.fullsize.file;
    } else {
      filepath = data.output.images.fullsize.file;
    }
    // read image from local file and assign to image element
    window.resolveLocalFileSystemURL(
      filepath,
      (fileEntry) => {
        fileEntry.file(
          (file) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const blob = new Blob([new Uint8Array(reader.result)], {
                type: "image/png",
              });
              imageRef.current.src = window.URL.createObjectURL(blob);
            };
            reader.readAsArrayBuffer(file);
          },
          (err) => {
            console.log("read", err);
          }
        );
      },
      (error) => {
        console.log(error);
      }
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
      fps: 15,
      hasThumbnail: false,
      cameraFacing: "front",
    };
    window.plugin.CanvasCamera.start(
      options,
      (err) => {
        console.log("Something went wrong!", err);
      },
      (stream) => readImageFile(stream)
    );
  };

  return (
    <Page name='home' className='home-component'>
      <h2 className='title'>Emotions Recognition</h2>
      <p className='sub-title'>How do you feel today?</p>

      {isMobile() ? (
        <img
          className='capturing-img'
          ref={imageRef}
          width='224'
          height='224'
          src='../static/placeholder.png'
        />
      ) : (
        <video className='capturing-video' ref={videoRef} autoPlay></video>
      )}

      <h2 className='recognized-title'>Recognised emotion:</h2>
      <p className='recognized-emotion'>{detectedEmotion}%</p>

      <p className='footer'>
        Created by <br /> Asial Corporation
      </p>
    </Page>
  );
};
export default HomePage;
