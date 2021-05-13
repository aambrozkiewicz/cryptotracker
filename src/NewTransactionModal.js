import { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import RadioGroup from "./RadioGroup";

export const COINS = ["ETH", "ETC"];
export const TYPE_SELL = "Sell";
export const TYPE_BUY = "Buy";

function NewTransactionModal({ submit, totalHodlByCoin }) {
  const [show, setShow] = useState(false);

  const [coin, setCoin] = useState("ETH");
  const [value, setValue] = useState(0);
  const [rate, setRate] = useState(0);
  const [type, setType] = useState(TYPE_BUY);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSubmit(event) {
    event.preventDefault();

    let left = 0;
    let right = 0;
    if (type === TYPE_BUY) {
      left = value;
      right = value / rate;
    } else {
      left = value * rate;
      right = value;
    }

    submit({
      coin,
      type,
      left,
      right,
      rate,
    });
    setShow(false);
  }

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} size="sm">
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
                  options={[TYPE_BUY, TYPE_SELL]}
                  onChange={(v) => setType(v)}
                  value={type}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formCoin">
                <Form.Label>Coin</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setCoin(e.target.value)}
                  value={coin}
                >
                  {COINS.map((coinName, i) => (
                    <option key={i} value={coinName}>
                      {coinName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formAmount">
                <Form.Label className="d-flex align-items-center justify-content-between">
                  {type === TYPE_BUY ? "EUR" : coin}
                  {type === TYPE_SELL && totalHodlByCoin[coin] > 0 && (
                    <a
                      href="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        setValue(totalHodlByCoin[coin]);
                      }}
                    >
                      max
                    </a>
                  )}
                </Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  value={value}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formrate">
                <Form.Label>Exchange rate</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                />
              </Form.Group>
            </Form.Row>
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
