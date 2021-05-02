import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Collapse } from "react-bootstrap";
import { Arrow, LargeText, StatsValue } from "./styles";

function CoinPair({
  pairName,
  loading,
  transactions,
  currentPrice,
  isEdit,
  deleteTransaction,
}) {
  const [open, setOpen] = useState(false);
  const [avgPrice, setAvgPrice] = useState(0);
  const [change, setChange] = useState(0);
  const hodl = transactions.reduce((p, c) => p + c.price / c.boughtAt, 0);
  const totalSpent = transactions.reduce((p, c) => p + c.price, 0);
  const total = currentPrice * hodl;

  useEffect(() => {
    setAvgPrice(
      transactions.reduce((p, c) => p + c.boughtAt, 0) / transactions.length
    );
  }, [transactions]);

  useEffect(() => {
    const currentChange = (currentPrice * 100) / avgPrice - 100;
    setChange(currentChange || 0);
  }, [currentPrice, avgPrice]);

  return (
    <>
      <Row className="mt-3">
        <Col
          sm={12}
          lg={true}
          className="align-items-center d-flex flex-grow-0"
        >
          <h3 style={{ whiteSpace: "nowrap" }} className="m-0">
            {pairName}{" "}
          </h3>
          {loading && (
            <Spinner animation="border" variant="primary" className="ml-2" />
          )}
        </Col>
        <Col className="d-flex align-items-center flex-grow-1">
          <div
            style={{
              height: "1px",
              width: "100%",
              backgroundColor: "#ccc",
            }}
          ></div>
        </Col>
        <Col className="text-left text-md-right flex-grow-0 text-nowrap">
          <StatsValue className="d-inline-block" value={change}>
            {(total - totalSpent).toLocaleString()} EUR / {change.toFixed(2)} %
          </StatsValue>
          <Arrow
            className="ml-3"
            onClick={() => setOpen((open) => !open)}
            upsidedown={open}
          />
        </Col>
      </Row>

      <Collapse in={open}>
        <div>
          <Row className="justify-content-between my-2">
            <Col sm={12} md={3} className="">
              <div className="text-muted">Current price</div>
              <LargeText>{currentPrice.toLocaleString()} EUR</LargeText>
            </Col>
            <Col sm={12} md={3} className="">
              <div className="text-muted">Avg price</div>
              <LargeText>{avgPrice.toLocaleString()} EUR</LargeText>
            </Col>
            <Col sm={12} md={3} className="">
              <div className="text-muted">HODL</div>
              <LargeText>{hodl}</LargeText>
            </Col>
            <Col sm={12} md={3} className="text-left text-md-right">
              <div className="text-muted">Total value</div>
              <StatsValue value={change}>
                {total.toLocaleString()} EUR
              </StatsValue>
            </Col>
          </Row>
          <Row>
            <Col>
              {transactions.map((t, i) => (
                <div
                  key={i}
                  className="mt-1 bg-white shadow rounded p-3 d-flex justify-content-between align-items-center"
                >
                  <LargeText>{t.price.toLocaleString()} EUR</LargeText>
                  <div>
                    <div className="text-right d-flex justify-content-center align-items-center">
                      Bought at
                      <br />
                      {t.boughtAt.toLocaleString()} EUR
                      {isEdit && (
                        <div className="ml-3">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteTransaction(t.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </div>
      </Collapse>
    </>
  );
}

export default CoinPair;
