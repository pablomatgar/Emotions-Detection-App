import React, { useRef } from "react";
import {
  Page,
  Button,
  BlockTitle,
  Block,
  Range,
  Stepper,
} from "framework7-react";

const SettingsPage = () => {
  const FPSref = useRef();
  const vibrationsRef = useRef();
  const predictionIntervalRef = useRef();
  const cameraRef = useRef();

  const saveSettings = () => {
    localStorage.setItem("vibrations", vibrationsRef.current.checked);
    localStorage.setItem("FPS", FPSref.current.getValue());
    localStorage.setItem(
      "predictionInterval",
      predictionIntervalRef.current.el.f7Range.value
    );
    localStorage.setItem("camera", cameraRef.current.value);
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
          value={+localStorage.getItem("FPS") || 10}
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

        <div className='list'>
          <ul>
            <li className='item-content item-input'>
              <div className='item-inner'>
                <div className='item-title item-label'>Camera</div>
                <div className='item-input-wrap input-dropdown-wrap'>
                  <select ref={cameraRef}>
                    <option value='Front'>Front</option>
                    <option value='Back'>Back</option>
                  </select>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className='block-title'>Vibrations</div>
        <div className='block-header'>
          Activate to vibrate while you are happy
        </div>
        <div className='list simple-list'>
          <ul>
            <li>
              <span>Vibrations</span>
              <label className='toggle toggle-init color-black'>
                <input
                  type='checkbox'
                  ref={vibrationsRef}
                  defaultChecked={
                    localStorage.getItem("vibrations") === "true" ? true : false
                  }
                />
                <span className='toggle-icon'></span>
              </label>
            </li>
          </ul>
        </div>

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
