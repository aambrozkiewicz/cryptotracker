import { useState } from "react";
import { Button, Col, Collapse, Row, Spinner } from "react-bootstrap";
import { Arrow, LargeText, StatsValue } from "./styles";

function Coin({
  pairName,
  loading,
  transactions,
  currentPrice,
  isEdit,
  deleteTransaction,
}) {
  const [open, setOpen] = useState(false);
  const hodl = Math.max(
    0,
    transactions.reduce((p, c) => p + (c.price * c.direction) / c.boughtAt, 0)
  );
  const totalSpent = transactions.reduce(
    (p, c) => p + c.price * c.direction,
    0
  );
  const totalValue = currentPrice * hodl;
  const profit = totalValue - totalSpent;

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
        <Col
          className="d-flex align-items-center"
          onClick={() => setOpen((open) => !open)}
        >
          <div
            style={{
              height: "1px",
              width: "100%",
              backgroundColor: "#ccc",
            }}
          ></div>
        </Col>
        <Col className="text-left text-md-right flex-grow-0 text-nowrap">
          <StatsValue className="d-inline-block" value={profit}>
            {profit.toLocaleString()} EUR /{" "}
            {totalSpent
              ? ((totalValue * 100) / totalSpent - 100).toFixed(2)
              : 0}{" "}
            %
          </StatsValue>
          <Arrow
            className="ml-2"
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
              <div className="text-muted">Investment</div>
              <LargeText>{totalSpent} EUR</LargeText>
            </Col>
            <Col sm={12} md={3} className="">
              <div className="text-muted">HODL</div>
              <LargeText>{hodl}</LargeText>
            </Col>
            <Col sm={12} md={3} className="text-left text-md-right">
              <div className="text-muted">Total value</div>
              <LargeText>{totalValue.toLocaleString()} EUR</LargeText>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="bg-white shadow rounded">
                {transactions.map((t, i) => (
                  <div
                    key={i}
                    className="mt-1 p-3 d-flex justify-content-between align-items-center border-bottom"
                  >
                    {t.direction === -1 ? (
                      <i className="icono-arrow1-right"></i>
                    ) : (
                      <i className="icono-arrow1-left"></i>
                    )}
                    <div className="text-right d-flex justify-content-center align-items-center">
                      {(t.price / t.boughtAt).toFixed(5)} /{" "}
                      {t.price.toLocaleString()} EUR @{" "}
                      {t.boughtAt.toLocaleString()}
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
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </Collapse>
    </>
  );
}

export default Coin;
