# Speech Recognition Cloud

This project is meant to be used only as a demo to communicate with external websocket services to process audio data send as PCM 16.

## Services

At the moment project supports only azure and google speech recognition APIs. There's no plan to support more types, hence the demo part of the project.

## Forms

Azure service will receive key and region as a query params in the websocket connection url. Google service will connect without params but will be sent a credentials in json format as the very first message.

## Messages

Web processes message in json format:

* Messages partially processed - speaker did not finished the sentence yet
```json
{
  "id": "string",
  "type": "partial",
  "message": "string"
}
```

* Messages believed to be finished by the speaker
```json
{
  "id": "string",
  "type": "final",
  "message": "string"
}
```
