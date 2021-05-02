import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

function NewTransactionModal({ submit }) {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(0);
  const [boughtAt, setBoughtAt] = useState(0);
  const [pair, setPair] = useState("BTCEUR");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSubmit(event) {
    event.preventDefault();

    submit({
      pair,
      price: parseFloat(price),
      boughtAt: parseFloat(boughtAt),
    });
    setShow(false);
  }

  return (
    <>
      <Button
        variant="outline-primary"
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
            <Form.Group controlId="formExchangePair">
              <Form.Label>Exhange pair</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setPair(e.target.value)}
                value={pair}
              >
                <option value={"BTCEUR"}>BTCEUR</option>
                <option value={"ETHEUR"}>ETHEUR</option>
                <option value={"DOGEEUR"}>DOGEEUR</option>
              </Form.Control>
            </Form.Group>
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
