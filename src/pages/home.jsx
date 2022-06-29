import React from "react";
import { Page } from "framework7-react";

const HomePage = () => {
  let isPhone = false;
  let recognizedEmotion = "Sad";

  return (
    <Page name='home' className='home-component'>
      <h2 className='title'>Emotions Recognition</h2>
      <p className='sub-title'>What emotions do you feel today?</p>

      {isPhone ? (
        <video
          className='capturing-video'
          // ref='videoRef'
          playsInline
          autoPlay
        ></video>
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
