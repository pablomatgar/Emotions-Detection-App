import React, { useEffect, useRef, useState } from "react";
import { Page, Button } from "framework7-react";
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
    console.log('model loaded');
  };

  useEffect(async () => {
    await loadModel();
    startVideo();
  }, []);

  const startVideo = async () => {
    if (isMobile()) {
      await startCanvasCamera();
      console.log('camera started');
      predictEmotion(imageRef.current);
    } else {
      await getBrowserCamera();
      console.log('camera started');
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

  // ------------------------- Predictions -------------------------
  const predictEmotion = (stream) => {
    setInterval(() => {
      if (!stream) return;
      faceapi
        .detectSingleFace(stream)
        .withFaceExpressions()
        .then(detectionWithExpressions => {
          setEmotionResult(detectionWithExpressions);
        });
    }, (+localStorage.getItem("predictionInterval") || 2) * 1000);
  };

  const setEmotionResult = (detectionWithExpressions) => {
    try {
      const singlePredictedEmotion = Object.entries(
        detectionWithExpressions.expressions
      ).filter((key) => {
        if (
          key[0] === "angry" &&
          localStorage.getItem("vibrations") === "true"
        ) {
          console.log("brrr");
          navigator.vibrate(1000);
        }
        key[0] = (key[0] + " ").toUpperCase();
        key[1] = Math.trunc(key[1] * 100);
        return key[1] > 80;
      });
      if (singlePredictedEmotion.length > 0) {
        setDetectedEmotion(
          singlePredictedEmotion.toString().replace(/,/g, "") + "%"
        );
      }
    } catch (error) {
      setDetectedEmotion("No face found");
    }
  };

  // ------------------------- Camera functions -------------------------
  // Desktop
  const getBrowserCamera = () => {
    return new Promise((resolve, reject) => {
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
        return resolve(stream);
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
        return reject(err);
      });
    });
  };

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
            reader.onloadend = () => {
              const blob = new Blob([new Uint8Array(reader.result)], {
                type: "image/png",
              });
              try {
                imageRef.current.src = window.URL.createObjectURL(blob);
              } catch (error) {
                console.warn("Video element has not loaded yet: " + error);
              }
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
    return new Promise((resolve, reject) => {
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
        fps: +localStorage.getItem("FPS") || 15,
        hasThumbnail: false,
        cameraFacing:
          // Camera will be front as a defaults
          localStorage.getItem("frontCamera") === "false" ? "back" : "front",
      };
      window.plugin.CanvasCamera.start(
        options,
        (err) => {
          console.log("Something went wrong!", err);
          return reject(err);
        },
        (stream) => {
          return resolve(readImageFile(stream));
        }
      );
    });
  };

  return (
    <Page name='home' className='container-component'>
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
      <p className='recognized-emotion'>{detectedEmotion}</p>
      <Button
        outline
        color='black'
        href='/settings'
        className='button'
        onClick={() => {
          if (isMobile()) {
            imageRef.current.src = null;
          } else {
            videoRef.current.srcObject = null;
          }
        }}
      >
        Settings
      </Button>
      
      <p className='footer'>
        Created by <br /> Asial Corporation
      </p>
    </Page>
  );
};
export default HomePage;
