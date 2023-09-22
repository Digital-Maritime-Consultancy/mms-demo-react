export const arraysEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const bytesToBase64 = (bytes: Uint8Array): string => {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
};

export const payloadToHtmlElem = (
  payload: Uint8Array
): HTMLElement | undefined => {
  const fileBytesArray = new TextEncoder().encode("FILE");
  const decoder = new TextDecoder();

  if (arraysEqual(payload.subarray(0, 4), fileBytesArray)) {
    for (let i = 4; i < payload.length; i++) {
      if (arraysEqual(payload.subarray(i, i + 4), fileBytesArray)) {
        const fileNameBytes = payload.subarray(4, i);
        const fileName = decoder.decode(fileNameBytes);
        const content = payload.subarray(i + 4);

        const downloadLink = document.createElement("a");
        downloadLink.href = "#";
        downloadLink.textContent = fileName;
        downloadLink.onclick = (e) => {
          let hidden_a = document.createElement("a");
          hidden_a.setAttribute(
            "href",
            "data:application/octet-stream;base64," + bytesToBase64(content)
          );
          hidden_a.setAttribute("download", fileName);
          document.body.appendChild(hidden_a);
          hidden_a.click();

          e.preventDefault();
        };

        return downloadLink;
      }
    }
  } else {
    const textElem = document.createElement("span");
    textElem.textContent = decoder.decode(payload);
    return textElem;
  }
};
