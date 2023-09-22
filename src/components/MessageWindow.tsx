import React, { useEffect, useRef } from "react";
import { IApplicationMessage } from "../generated/mmtp";
import { payloadToHtmlElem } from "../util/PayloadHandler";

interface MessageWindowProps {
  message?: IApplicationMessage;
}

export const MessageWindow = ({ message }: MessageWindowProps) => {
  const incomingAreaRef = useRef<HTMLDivElement>(null);

  

  useEffect(() => {
    if (!message) {
      return;
    }
    const incomingArea = incomingAreaRef.current;
    const payload = message.body!;
    const htmlComponent = payloadToHtmlElem(payload);
    incomingArea?.append(htmlComponent!);
    let br = document.createElement("br");
    incomingArea?.append(br);
  }, [message]);

  return (
    <div
      className="form-control h-75"
      id="incomingArea"
      ref={incomingAreaRef}
    ></div>
  );
};
