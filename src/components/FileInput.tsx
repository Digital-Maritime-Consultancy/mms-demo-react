import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export interface FileInputProp {
    setBytes: (bytes: Uint8Array) => void;
}

export const FileInput = forwardRef((props: FileInputProp, ref) => {
    const [fileLoaded, setFileLoaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetFileInput = () => {
        if (fileInputRef.current) {
            setFileName("");
            setFileLoaded(false);
            fileInputRef.current!.value = '';
        }
    };

    useImperativeHandle(ref, () => ({
        resetFileInput,
      }));

    const encodeFile = (fileName: string, data: Uint8Array): Uint8Array => {
        const fileNameArray = new TextEncoder().encode("FILE" + fileName + "FILE");
        const mergedArray = new Uint8Array(fileNameArray.length + data.length);
        mergedArray.set(fileNameArray);
        mergedArray.set(data, fileNameArray.length);
        return mergedArray;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
    
        if (file) {
            file.arrayBuffer().then((buff: any) => {
                let data = new Uint8Array(buff); // x is your uInt8Array
                // perform all required operations with x here.
                const encodedFile = encodeFile(file.name, data);
                props.setBytes(encodedFile);
                setFileLoaded(true);
                setFileName(file.name);
                fileInputRef.current!.value = '';
            });
        }
      };

    return (
        <div>
            <label htmlFor="msgArea" className="form-label">Select File Here</label>
            <input ref={fileInputRef} type="file" id="fileInput" onChange={handleFileChange}/>
            <div className="container">
                {fileLoaded && <div id="file-state-loaded" className="bg-success text-white py-2 px-3 mb-3">File loaded: {fileName}</div>}
                {!fileLoaded && <div id="file-state-unloaded" className="bg-secondary text-white py-2 px-3">File not chosen</div>}
            </div>
        </div>
    )
});