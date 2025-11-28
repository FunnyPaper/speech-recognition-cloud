import { useEffect, useMemo } from "react";
import Dropzone from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import styles from './google-connect.form.module.css';

export type GoogleConnectFormData = {
  endpoint: string;
  credentials: string;
}

export type GoogleConnectFormProps = {
  connect: (url: string) => Promise<void>;
  disconnect: () => void,
  sendMessage: (message: Parameters<WebSocket['send']>[number]) => void,
  isConnected: boolean;
  onDisconnect: () => void;
}

export default function GoogleConnectForm({
  connect, disconnect, sendMessage, isConnected, onDisconnect
}: GoogleConnectFormProps) {
  const { register, handleSubmit, control } = useForm<GoogleConnectFormData>();

  const submit = useMemo(() => handleSubmit((data) => {
    const endpoint = data['endpoint'];
    const credentials = data['credentials'];
    connect(endpoint).then(() => sendMessage(credentials));
  }), [connect, handleSubmit, sendMessage]);

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
      <Controller
        name="credentials"
        control={control}
        render={({ field }) => (
          <Dropzone
            maxFiles={1}
            accept={{
              "application/json": [".json"]
            }}
            onDrop={(files) => {
              const file = files[0];
              const reader = new FileReader();

              reader.onabort = () => console.warn("Reading aborted");
              reader.onerror = () => console.error("Reading failed");

              reader.onload = () => {
                const bin = reader.result;
                field.onChange(bin);
              }

              reader.readAsText(file);
            }}>
            {({ getRootProps, getInputProps }) => (
              <section className={styles['dropzone']}>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <span className={styles['dropzone-hint']}>{field.value ? "Change credentials" : "Drag 'n' drop or click 'n' select file with credentials"}</span>
                  <span className={styles['dropzone-extensions']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19h2v-4.175l1.6 1.6L16 15l-4-4l-4 4l1.425 1.4L11 14.825zm-5 3q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13h5l-5-5z" /></svg>
                    <span>.json</span>
                  </span>
                </div>
              </section>
            )}
          </Dropzone>
        )}
      />
      {isConnected
        ? <button type="button" onClick={onDisconnect}>Disconnect</button>
        : <input type="submit" value="Connect" />
      }
    </form>
  )
}