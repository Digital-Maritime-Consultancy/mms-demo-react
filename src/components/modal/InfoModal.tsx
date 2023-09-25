import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "react-bootstrap";

export interface InfoModalProp {
}

export const InfoModal = forwardRef(
  ({ }: InfoModalProp, ref) => {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleOpenModal = () => {
      setShowModal(true);
    };

    useImperativeHandle(ref, () => ({
      openModal: () => handleOpenModal(),
    }));

    return showModal ? (
      <div
        className="modal show"
        style={{
          display: "block",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>What is MMS?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The MMS is a messaging service intended to offer transparent
            seamless information transfer across different communication links
            in a carrier agnostic and geolocation-context sensitive manner. The
            MMS primarily addresses ship-shore communication based on internet
            connectivity, yet any number of alternative communication services
            may be connected to and utilized by the MMS via dedicated gateways.
            As an example, a message, sent by one specific ship using INMARSAT
            access to the MMS, may be received via a VSAT terminal on another
            ship, an HF data connection on yet another ship, or a VTS operator
            on a DSL landline internet connection. In the current implementation
            the MMS enables the transfer by using the MRN of an entity as an
            end-point address. Each communication service will impose technology
            and situation specific limitations in terms of restrictions to
            capabilities, bandwidth availability, size of transferrable data
            packages, latencies, etc. – but basic transfer of text or structured
            data (e.g. using XML) will be possible. It is the intend that the
            MMS will be standardised through RTCM – and a dedicated working
            group has been established in RTCM to work on this topic. The
            following document is a DRAFT working document describing the
            overall architecture and the main MMS protocol (Maritime Message
            Transfer Protocol MMTP). As a draft – this document has obviously
            neither been adopted by the MCC nor RTCM.
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => handleCloseModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    ) : (
      <></>
    );
  }
);
