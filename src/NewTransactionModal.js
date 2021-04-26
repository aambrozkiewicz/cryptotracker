import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

function NewTransactionModal({ submit }) {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(0);
  const [boughtAt, setBoughtAt] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSubmit(event) {
    event.preventDefault();
    submit({
      price,
      boughtAt,
    });
    setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add new transaction
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>New transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formAmountSpent">
              <Form.Label>Amount spent</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share this with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBoughtAt">
              <Form.Label>Bought at</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setBoughtAt(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewTransactionModal;
