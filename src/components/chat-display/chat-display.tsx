import { useEffect, useState } from 'react';
import styles from './chat-display.module.css';

type ChatRecordProps = {
  text?: string,
  speaker?: string
}

function ChatRecord({ text, speaker = "?" }: ChatRecordProps) {
  return (
    <span className={styles['chat-record']}>
      <p className={styles['chat-record-speaker']}>{`${speaker}>`}</p>
      <p className={styles['chat-record-content']}>{text}</p>
    </span>
  )
}

export type ChatDisplayProps = {
  listenMessage: (callback: (message: MessageEvent) => void) => () => void;
}

export default function ChatDisplay({ listenMessage }: ChatDisplayProps) {
  const [sentences, setSentences] = useState<{ id: string, text: string, speaker: string }[]>([]);
  const [currentSentence, setCurrentSentence] = useState<{ text: string, speaker: string }>();

  useEffect(() => {
    const unlistenMessage = listenMessage((message) => {
      const data = JSON.parse(message.data);
      if (data.type == 'partial') {
        setCurrentSentence({ text: data.text, speaker: data.speaker });
      } else if (data.type == "final") {
        setCurrentSentence(undefined);
        setSentences(prev => [{ id: data.id, text: data.text, speaker: data.speaker }, ...prev]);
      }
    });

    return unlistenMessage;
  }, [listenMessage]);

  return (
    <div className={styles['chat']}>
      <div className={styles['chat-records']}>
        {sentences.map(sentence => (<ChatRecord key={sentence.id} text={sentence.text} />))}
      </div>
      <div className={styles['current-sentence']}>
        <ChatRecord
          speaker={currentSentence?.speaker}
          text={currentSentence?.text} />
      </div>
    </div>
  )
}