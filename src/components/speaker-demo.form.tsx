import Select from "react-select";
import useMicrophoneDevices from "../hooks/use-microphone-devices.hook";
import { useEffect, useState } from "react";
import styles from './speaker-demo.module.css';
import ChatDisplay from "./chat-display";

export type SpeakerDemoFormProps = {
  isConnected: boolean,
  sendMessage: (message: Parameters<WebSocket["send"]>[number]) => void,
  listenMessage: (callback: (message: MessageEvent) => void) => () => void;
}

export default function SpeakerDemoForm({ isConnected, sendMessage, listenMessage }: SpeakerDemoFormProps) {
  const [mic, setMic] = useState<string>();
  const { mics, streamFor } = useMicrophoneDevices();
  const deviceListOptions = mics.map(mic => ({
    value: mic.deviceId,
    label: mic.label
  }));

  useEffect(() => {
    if (mic && isConnected) {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const src = audioContext.audioWorklet.addModule("/audio.worklet.js")
        .then(() => streamFor(mic))
        .then((stream) => {
          const src = audioContext.createMediaStreamSource(stream);

          const workletNode = new AudioWorkletNode(audioContext, "pcm-worklet");
          workletNode.port.onmessage = (event) => {
            const pcm16 = event.data as Int16Array;
            sendMessage(pcm16);
          };

          src.connect(workletNode);

          return Promise.resolve(src);
        });

      return () => void src.then(s => s.disconnect());
    }
  }, [sendMessage, streamFor, mic, isConnected])

  return (
    <div className={styles['form']}>
      <Select
        className={styles['mic']}
        isClearable
        options={deviceListOptions}
        onChange={(value) => setMic(value?.value)}
        value={deviceListOptions.find(option => option.value == mic)}
        placeholder="Select microphone"
        styles={{
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            backgroundColor: isSelected || isFocused ? "#949494" : "#242424"
          }),
          control: (base) => ({
            ...base,
            width: "100%",
            height: "100%",
            minHeight: "48px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#1a1a1a"
          }),
          placeholder: (base) => ({
            ...base,
            color: 'unset'
          }),
          singleValue: (base) => ({
            ...base,
            color: 'unset'
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#1a1a1a",
            color: "white"
          }),
          menuList: (base) => ({
            ...base,
            backgroundColor: "#1a1a1a"
          })
        }}
      />

      <div className={styles['chat']}>
        <ChatDisplay listenMessage={listenMessage} />
      </div>
    </div>
  )
}