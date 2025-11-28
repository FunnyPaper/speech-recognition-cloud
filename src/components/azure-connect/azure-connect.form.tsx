import { useForm } from "react-hook-form";
import styles from './azure-connect.form.module.css';
import { useEffect, useMemo } from "react";

export type AzureConnectFormData = {
  endpoint: string;
  key: string;
  region: string;
}

export type AzureConnectFormProps = {
  connect: (url: string) => Promise<void>;
  disconnect: () => void,
  isConnected: boolean;
  onDisconnect: () => void;
}

export default function AzureConnectForm({
  connect, disconnect, isConnected, onDisconnect
}: AzureConnectFormProps) {
  const { register, handleSubmit } = useForm<AzureConnectFormData>();

  const submit = useMemo(() => handleSubmit((data) => {
    const endpoint = data['endpoint'];
    const region = data['region'];
    const key = data['key'];
    connect(`${endpoint}?key=${key}&region=${region}`);
  }), [connect, handleSubmit]);

  useEffect(
    () => () => void (isConnected && disconnect()),
    [disconnect, isConnected]
  );

  return (
    <form className={styles['form']} onSubmit={submit}>
      <label>
        <span>Endpoint</span>
        <input type="url" placeholder="" readOnly={isConnected} {...register('endpoint', { required: true, })} />
      </label>
      <label>
        <span>Key</span>
        <input type="password" placeholder="" readOnly={isConnected} {...register('key', { required: true })} />
      </label>
      <label>
        <span>Region</span>
        <input type="text" placeholder="" readOnly={isConnected} {...register('region', { required: true })} />
      </label>
      {isConnected
        ? <button type="button" onClick={onDisconnect}>Disconnect</button>
        : <input type="submit" value="Connect" />
      }
    </form>
  )
}