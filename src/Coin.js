import { useState } from "react";
import { Button, Col, Collapse, Row, Spinner } from "react-bootstrap";
import { SELL } from "./NewTransactionModal";
import { Arrow, LargeText, SmallLabel, StatsValue } from "./styles";

function Coin({ instrument, currentPrice, loading, edit, deleteTransaction }) {
  const [open, setOpen] = useState(false);
  const totalSpent = instrument.transactions.reduce(
    (p, c) => p + c.price * c.direction,
    0
  );
  const totalValue = currentPrice * instrument.totalHodl;
  const profit = totalValue - totalSpent - instrument.totalTakeProfit;

  return (
    <>
      <Row className="mt-3">
        <Col
          sm={12}
          lg={true}
          className="align-items-center d-flex flex-grow-0"
        >
          <Arrow
            className="mr-3"
            onClick={() => setOpen((open) => !open)}
            upsidedown={open}
          />
          <h3 style={{ whiteSpace: "nowrap" }} className="m-0">
            {instrument.name}
          </h3>
          {loading && (
            <Spinner animation="border" variant="primary" className="ml-2" />
          )}
        </Col>
        <Col className="d-none d-lg-flex align-items-center">
          <div
            style={{
              height: "1px",
              width: "100%",
              backgroundColor: "#dadada",
            }}
          ></div>
        </Col>
        <Col className="text-left text-md-right flex-grow-0 text-nowrap">
          <StatsValue className="d-inline-block" value={profit}>
            {profit.toLocaleString()} EUR{" "}
            {totalSpent
              ? ((totalValue * 100) / totalSpent - 100).toFixed(2)
              : 0}{" "}
            %
          </StatsValue>
        </Col>
      </Row>

      <Collapse in={open}>
        <div>
          <Row className="my-2">
            <Col sm={12} md={3} className="">
              <SmallLabel>Current price</SmallLabel>
              <LargeText>{currentPrice.toLocaleString()} EUR</LargeText>
            </Col>
            <Col sm={12} md={3} className="">
              <SmallLabel>Acquisition Cost</SmallLabel>
              <LargeText>{totalSpent.toLocaleString()} EUR</LargeText>
            </Col>
            <Col sm={12} md={3} className="">
              <SmallLabel>HODL</SmallLabel>
              <LargeText>{instrument.totalHodl}</LargeText>
            </Col>
            <Col sm={12} md={3} className="text-left text-md-right">
              <SmallLabel>Current Holdings</SmallLabel>
              <LargeText>{totalValue.toLocaleString()} EUR</LargeText>
            </Col>
          </Row>

          <div className="bg-white shadow rounded">
            {instrument.transactions.map((t, i) => (
              <div className="border-bottom p-2">
                <Row className="align-items-center">
                  <Col xs={6} lg={3}>
                    <SmallLabel>Rate</SmallLabel>
                    {t.rate.toLocaleString()} EUR
                  </Col>
                  <Col xs={6} lg={3}>
                    <SmallLabel>Take profit</SmallLabel>
                    {t.takeProfit}
                  </Col>
                  <Col xs={6} lg={3} className="text-left text-lg-left">
                    <SmallLabel>Date</SmallLabel>
                    {t.date.toLocaleString()}
                  </Col>
                  <Col xs={12} lg={3}>
                    <div
                      className="d-flex justify-content-between align-items-center text-left text-lg-right mt-2 mt-lg-0"
                      style={{ minHeight: "32px" }}
                    >
                      <div className="w-100">
                        <div>{(t.price / t.rate).toFixed(5)}</div>
                        <div>{t.price.toLocaleString()} EUR</div>
                      </div>
                      {edit && (
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="ml-0 ml-lg-3 mr-lg-2"
                          onClick={() => deleteTransaction(t.id)}
                        >
                          &#x2715;
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </>
  );
}

export default Coin;
