import { useCallback, useEffect, useState } from "react";

export default function useMicrophoneDevices() {
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function getMics() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind == 'audioinput');

        setMics(audioInputs);
      } catch(err) {
        console.error('Error accessing microphones: ', err);
      }
    }

    getMics();
  }, []);

  const streamFor = useCallback((id: string) => 
    navigator.mediaDevices.getUserMedia({ audio: { advanced: [{ deviceId: id }]}})
  , []);

  return { mics, streamFor };
}