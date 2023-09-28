import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Alert } from "react-bootstrap";

const ErrorAlert = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");

  // On componentDidMount set the timer
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [show]);

  useImperativeHandle(ref, () => ({
    openAlert: (content: string) => {setContent(content); setShow(true)},
  }));

  // If show is false the component will return null and stop here
  if (!show) {
    return null;
  }

  // If show is true this will be returned
  return (
    <div
      className="modal show"
      style={{
        display: "block",
        position: "absolute",
        bottom: "10px",
        left: "60px",
      }}
    >
      <Alert variant="danger">{content}</Alert>
    </div>
  );
});

export default ErrorAlert;
