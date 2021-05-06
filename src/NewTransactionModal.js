import { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import RadioGroup from "./RadioGroup";

export const PAIRS = {
  BTCEUR: {
    symbol: "BTCEUR",
    left: "BTC",
    right: "EUR",
  },
  ETHEUR: {
    symbol: "ETHEUR",
    left: "ETH",
    right: "EUR",
  },
  XLMEUR: {
    symbol: "XLMEUR",
    left: "XLM",
    right: "EUR",
  },
};

export const SELL = -1;
export const BUY = 1;

function NewTransactionModal({ submit }) {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(0);
  const [boughtAt, setBoughtAt] = useState(0);
  const [pair, setPair] = useState(PAIRS["BTCEUR"]);
  const [direction, setDirection] = useState("Buy");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSubmit(event) {
    event.preventDefault();

    submit({
      pair,
      price: parseFloat(price),
      boughtAt: parseFloat(boughtAt),
      direction: direction === SELL ? -1 : 1,
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
            <Form.Row>
              <Form.Group
                as={Col}
                className="d-flex align-items-center justify-content-center"
              >
                <RadioGroup
                  options={["Buy", "Sell"]}
                  onChange={(v) => setDirection(v)}
                  value={direction}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formExchangePair">
                <Form.Label>Exhange pair</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setPair(PAIRS[e.target.value])}
                  value={pair.symbol}
                >
                  {Object.keys(PAIRS).map((pairName, i) => (
                    <option key={i} value={pairName}>
                      {pairName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="formAmountSpent">
              <Form.Label>{pair.right}</Form.Label>
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
              <Form.Label>Exchange rate</Form.Label>
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
