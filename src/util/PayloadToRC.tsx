import { arraysEqual, bytesToBase64 } from "./PayloadHandler";

export const payloadToRC = (payload: Uint8Array): JSX.Element | undefined => {
  const fileBytesArray = new TextEncoder().encode("FILE");
  const decoder = new TextDecoder();

  if (arraysEqual(payload.subarray(0, 4), fileBytesArray)) {
    for (let i = 4; i < payload.length; i++) {
      if (arraysEqual(payload.subarray(i, i + 4), fileBytesArray)) {
        const fileNameBytes = payload.subarray(4, i);
        const fileName = decoder.decode(fileNameBytes);
        const content = payload.subarray(i + 4);
        
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              let hidden_a = document.createElement("a");
              hidden_a.setAttribute(
                "href",
                "data:application/octet-stream;base64," + bytesToBase64(content)
              );
              hidden_a.setAttribute("download", fileName);
              document.body.appendChild(hidden_a);
              hidden_a.click();
            }}
          >
            {fileName}
          </a>
        );
      }
    }
  } else {
    return <span>{decoder.decode(payload)}</span>;
  }
};
