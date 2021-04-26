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
      price: parseFloat(price),
      boughtAt: parseFloat(boughtAt),
    });
    setShow(false);
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        size="sm"
        style={{ whiteSpace: "nowrap" }}
      >
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
                step="any"
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
                step="any"
                onChange={(e) => setBoughtAt(e.target.value)}
              />
            </Form.Group>
            <div className="text-right">
              <Button variant="primary" type="submit" size="sm">
                Add
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewTransactionModal;
