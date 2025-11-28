import { useState } from 'react';
import styles from './form-card.module.css';
import Select from 'react-select';
import AzureConnectForm from '../azure-connect/azure-connect.form';
import SpeakerDemoForm from '../speaker-demo/speaker-demo.form';
import useWebsocket from '../../hooks/use-websocket.hook';
import GoogleConnectForm from '../google-connect/google-connect.form';

export type FormCardProps = {
  onClose: () => void;
}

export default function FormCard({ onClose }: FormCardProps) {
  const [service, setService] = useState<'azure' | 'google'>();
  const { connect, disconnect, isConnected, sendMessage, listenMessage } = useWebsocket();

  const options = [
    { value: 'azure', label: 'Azure' },
    { value: 'google', label: 'Google' }
  ] as const

  return (
    <div className={styles['grid']}>
      <Select
        className={`${styles['item']} ${styles['header']}`}
        isClearable
        options={options}
        onChange={(value) => setService(value?.value)}
        value={options.find(option => option.value === service)}
        placeholder="Service Type"
        styles={{
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            backgroundColor: isSelected || isFocused ? "#949494" : "#242424"
          }),
          control: (base) => ({
            ...base,
            width: "100%",
            height: "100%",
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
      <button className={`${styles['item']} ${styles['cta']}`} onClick={onClose} >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5 13v-2h14v2z" />
        </svg>
      </button >
      {service == 'azure' &&
        <div className={`${styles['item']} ${styles['form']}`}>
          <AzureConnectForm
            connect={connect}
            disconnect={disconnect}
            isConnected={isConnected}
            onDisconnect={disconnect}
          />
        </div>}
      {service == 'google' &&
        <div className={`${styles['item']} ${styles['form']}`}>
          <GoogleConnectForm
            connect={connect}
            disconnect={disconnect}
            sendMessage={sendMessage}
            isConnected={isConnected}
            onDisconnect={disconnect}
          />
        </div>}
      <div style={{
        gridRow: service ? "3" : "2 / span 2",
      }} className={`${styles['item']} ${styles['content']}`}>
        <SpeakerDemoForm
          isConnected={isConnected}
          sendMessage={sendMessage}
          listenMessage={listenMessage}
        />
      </div>
    </div >
  )
}