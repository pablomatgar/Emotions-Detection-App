import React, { useRef } from "react";
import {
  Page,
  Button,
  BlockTitle,
  Block,
  Range,
  Stepper,
  ListItem,
  Toggle,
} from "framework7-react";

const SettingsPage = () => {
  const FPSref = useRef();
  const vibrationsRef = useRef();
  const predictionIntervalRef = useRef();
  const frontCameraRef = useRef();

  const saveSettings = () => {
    localStorage.setItem("vibrations", vibrationsRef.current.f7Toggle().checked);
    localStorage.setItem("FPS", FPSref.current.getValue());
    localStorage.setItem(
      "predictionInterval",
      predictionIntervalRef.current.el.f7Range.value
    );
    localStorage.setItem("frontCamera", frontCameraRef.current.selected);
  };

  return (
    <>
      <Page name='settings' className='container-component'>
        <h2 className='title'>Settings</h2>

        <BlockTitle>FPS of camera</BlockTitle>
        <Stepper
          type='text'
          readOnly
          min={10}
          max={50}
          step={5}
          color='black'
          ref={FPSref}
          value={+localStorage.getItem("FPS") || 15}
        />

        <BlockTitle>Prediction Interval</BlockTitle>
        <Block strong>
          <Range
            min={1}
            max={10}
            label={true}
            step={1}
            scale={true}
            scaleSteps={9}
            scaleSubSteps={1}
            ref={predictionIntervalRef}
            value={+localStorage.getItem("predictionInterval") || 2}
          />
        </Block>

        <BlockTitle>Camera</BlockTitle>
        <div className='block-header'>
          Choose which camera will predict emotions
        </div>
        
        <Block strong smartSelect>
        <select name="Camera" defaultValue={localStorage.getItem("frontCamera") === "true"
                      ? "front"
                      : "back"}>
          <option value="front" ref={frontCameraRef}>Front</option>
          <option value="back">Back</option>
        </select>
      </Block>

      <BlockTitle>Vibrations</BlockTitle>
        <div className='block-header'>
          Activate to vibrate while you are happy
        </div>
        <Block strong>
          <span>Vibrations</span>
        <Toggle defaultChecked={
                    localStorage.getItem("vibrations") === "true" ? true : false
                  } ref={vibrationsRef}></Toggle>
      </Block>
       
        <Button
          outline
          color='black'
          href='/'
          className='button'
          onClick={saveSettings}
        >
          Apply
        </Button>
      </Page>
    </>
  );
};

export default SettingsPage;
