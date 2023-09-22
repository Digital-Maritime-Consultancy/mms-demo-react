import React, { useEffect, useRef } from 'react';
import { IApplicationMessage } from '../generated/mmtp';

interface MessageWindowProps {
    message?: IApplicationMessage;
}

export const MessageWindow = ({ message }: MessageWindowProps) => {
  const incomingAreaRef = useRef<HTMLDivElement>(null);

  const arraysEqual = (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
  }

  const bytesToBase64 = (bytes: Uint8Array): string => {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
    }

  useEffect(() => {
    if (!message){
        return ;
    }
    const incomingArea = incomingAreaRef.current;
    const fileBytesArray = new TextEncoder().encode('FILE');
    const decoder = new TextDecoder();
    const payload = message.body!;

    if (arraysEqual(payload.subarray(0, 4), fileBytesArray)) {
      for (let i = 4; i < payload.length; i++) {
        if (arraysEqual(payload.subarray(i, i + 4), fileBytesArray)) {
          const fileNameBytes = payload.subarray(4, i);
          const fileName = decoder.decode(fileNameBytes);
          const content = payload.subarray(i + 4);

          incomingArea!.append(`${message.header!.sender} sent: `);
          const downloadLink = document.createElement('a');
          downloadLink.href = '#';
          downloadLink.textContent = fileName;
          downloadLink.onclick = (e) => {
            let hidden_a = document.createElement('a');
            hidden_a.setAttribute(
              'href',
              'data:application/octet-stream;base64,' + bytesToBase64(content)
            );
            hidden_a.setAttribute('download', fileName);
            document.body.appendChild(hidden_a);
            hidden_a.click();

            e.preventDefault();
          };

          // Append the download link to the textarea
          incomingArea!.appendChild(downloadLink);

         // Append a line break after the link
         incomingArea!.appendChild(document.createElement('br'));

         break;
        }
      }
    } else {
      const text = decoder.decode(payload);
      incomingArea!.append(`${message.header!.sender} sent: ${text}\n`);
    }
  }, [message]);

  return (
    <div className="form-control h-75" id="incomingArea" ref={incomingAreaRef}></div>
  );
}
