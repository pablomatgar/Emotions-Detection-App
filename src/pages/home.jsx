import React, { useRef, useState } from "react";
import { Page, Button, Navbar, NavRight } from "framework7-react";
import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import placeholder from "../static/placeholder.png";
import Gear from "framework7-icons/react/cjs/Gear";
import hybridFunctions from "../js/hybridFunctions";

const HomePage = () => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [detectedEmotion, setDetectedEmotion] = useState("Loading...");
  const [isPlay, setIsPlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const MODEL_URL = "models";
  const ANGRY_EMOTION = "ANGRY";
  let cont = 0;

  /* Page init */
  const init = async () => {
    try {
      // load model
      await loadModel();
      // predict with dummy picture
      predicting(imageRef.current);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  /* Load FaceAPI models */
  const loadModel = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    } catch (err) {
      console.log(err);
    }
  };

  /* Start Phone/Browser camera */
  const startVideo = async () => {
    try {
      if (hybridFunctions.isMobile()) {
        await startCanvasCamera();
        predictEmotion(imageRef.current);
      } else {
        window.stream = await getBrowserCamera();
        predictEmotion(videoRef.current);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------------- Predictions -------------------------
  /* Toggle Start/Stop prediction */
  const start = () => {
    try {
      if (!isPlay) {
        startVideo();
      } else {
        stopVideo();
      }
      setIsPlay(!isPlay);
    } catch (err) {
      console.log(err);
    }
  };

  /* Prediction emotion every 5 seconds */
  const predictEmotion = (stream) => {
    window.interval = setInterval(() => {
      if (!stream) return;
      setDetectedEmotion("Predicting...");
      predicting(stream);
    }, (+localStorage.getItem("predictionInterval") || 5) * 1000);
  };

  /* Prediction emotion form camera stream */
  const predicting = (stream) => {
    faceapi
      .detectSingleFace(stream)
      .withFaceExpressions()
      .then((detectionWithExpressions) => {
        setEmotionResult(detectionWithExpressions);
      })
      .catch((err) => console.log(err));
  };

  /* Return detected emotion with high confidence value */
  const getDetectedEmotion = (detectionWithExpressions) => {
    return Object.entries(
      detectionWithExpressions.expressions
    ).filter((key) => {
      key[0] = (key[0] + " ").toUpperCase();
      key[1] = Math.trunc(key[1] * 100);
      return key[1] > 80;
    });
  };

  /* Display result */
  const setEmotionResult = (detectionWithExpressions) => {
    try {
      const singlePredictedEmotion = getDetectedEmotion(detectionWithExpressions);
      if (singlePredictedEmotion.length > 0) {
        // Vibrate phone if the detection emotion is "Angry"
        if (
          singlePredictedEmotion[0][0].trim().toUpperCase() === ANGRY_EMOTION &&
          localStorage.getItem("vibrations") === "true"
        ) {
          console.log("brrr");
          navigator.vibrate(1000);
        }
        cont = 0;
        setDetectedEmotion(
          singlePredictedEmotion.toString().replace(/,/g, "") + "%"
        );
      }
    } catch (error) {
      if (!isLoaded) {
        setDetectedEmotion("Ready");
      } else {
        cont++;
        setDetectedEmotion("No face found");
        // Stop prediction interval if there are too many errors
        if (cont === 3) {
          setIsPlay(false);
          stopVideo();
          cont = 0;
        }
      }
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
    if (hybridFunctions.isAndroid()) {
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
            console.log("error reading image file", err);
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

  const stopVideo = () => {
    try {
      if (hybridFunctions.isMobile()) {
        window.plugin.CanvasCamera.stop(
          (err) => {
            console.log("Something went wrong!", err);
          },
          () => {
            imageRef.current.src = placeholder;
          }
        );
      } else {
        window.stream.getTracks().forEach(function (track) {
          track.stop();
        });
        imageRef.current.src = placeholder;
      }
      clearInterval(window.interval);
      setDetectedEmotion("Ready");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page name='home' className='container-component' onPageInit={init}>
      <Navbar>
        <NavRight>
          <a href='/settings' slot='right'>
            <Gear style={{ fontSize: "25px", margin: " 5px 5px 0 0" }} />
          </a>
        </NavRight>
      </Navbar>
      <h2 className='title'>Emotions Recognition</h2>
      <p className='sub-title'>How do you feel today?</p>

      {hybridFunctions.isMobile() ? (
        <img
          className='capturing-img'
          ref={imageRef}
          width='224'
          height='224'
          src={placeholder}
        />
      ) : (
        <div>
          <video
            className='capturing-video'
            ref={videoRef}
            autoPlay
            hidden={!isPlay}
          ></video>
          <img
            className='capturing-img'
            ref={imageRef}
            width='224'
            height='224'
            src={placeholder}
            hidden={isPlay}
          />
        </div>
      )}

      <h2 className='recognized-title'>Recognised emotion:</h2>
      <p className='recognized-emotion'>{detectedEmotion}</p>
      <Button
        outline
        color='black'
        className='button'
        disabled={!isLoaded}
        onClick={start}
      >
        {!isPlay ? "Play" : "Stop"}
      </Button>
      <p className='footer'>
        Created by <br /> Asial Corporation
      </p>
    </Page>
  );
};
export default HomePage;
