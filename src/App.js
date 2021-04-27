import { Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import "./App.css";
import NewTransactionModal from "./NewTransactionModal";
import { fetchLatestPrice } from "./utils";

const LargeText = styled.div`
  font-size: x-large;
  word-wrap: nowrap;
  white-space: nowrap;
`;

const StatsValue = styled(LargeText)`
  color: ${(props) => (props.value > 0 ? "#03cea4" : "#eb5e28")};
`;

function App() {
  const [transactions, setTransactions] = useState(() => {
    const local = window.localStorage.getItem("transactions");
    return local
      ? JSON.parse(local)
      : [{ price: 180.85, boughtAt: 44687.113, fee: 0 }];
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [change, setChange] = useState(0);
  const hodl = transactions.reduce(
    (p, c) => p + (c.price - c.fee) / c.boughtAt,
    0
  );
  const totalSpent = transactions.reduce((p, c) => c.price, transactions);
  const total = currentPrice * hodl;

  async function fetchPrice() {
    setLoading(true);
    const priceResponse = await fetchLatestPrice();
    setLoading(false);
    setCurrentPrice(parseFloat(priceResponse.price));
  }

  useEffect(() => {
    fetchPrice();
    setAvgPrice(
      transactions.reduce((p, c) => p + c.boughtAt, 0) / transactions.length
    );

    window.localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    const currentChange = (currentPrice * 100) / avgPrice - 100;
    setChange(currentChange || 0);
  }, [currentPrice, avgPrice]);

  function addNewTransaction(transaction) {
    setTransactions([...transactions, { ...transaction, fee: 0 }]);
  }

  function deleteTransaction(index) {
    const copy = [...transactions];
    copy.splice(index, 1);
    setTransactions(copy);
  }

  return (
    <Container className="mt-3">
      <Row>
        <Col className="d-flex justify-content-between align-items-center">
          <h1 className="header">tracker</h1>
          <Button onClick={fetchPrice} variant="outline-primary" size="sm">
            Fetch
          </Button>
        </Col>
      </Row>
      <Row className="mt-3 justify-content-between">
        <Col sm={12} md="auto" className="p-3 p-md-3">
          <div>Current price</div>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <LargeText>{currentPrice.toLocaleString()} EUR</LargeText>
          )}
        </Col>
        <Col className="p-3 p-md-3">
          <div>Avg price</div>
          <LargeText>{avgPrice.toLocaleString()} EUR</LargeText>
        </Col>
        <Col className="p-3 p-md-3">
          <div>HODL</div>
          <LargeText>{hodl} BTC</LargeText>
        </Col>
        <Col className="p-3 p-md-3">
          <div>Change</div>
          <StatsValue value={change}>{change} %</StatsValue>
        </Col>
      </Row>
      <Row>
        <Col>
          {transactions.map((t, i) => (
            <div
              key={i}
              className="mt-2 border-bottom d-flex justify-content-between align-items-center"
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
                        onClick={() => deleteTransaction(i)}
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
      <Row className="mt-3">
        <Col>
          <NewTransactionModal submit={addNewTransaction} />{" "}
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setIsEdit((e) => !e)}
          >
            Edit
          </Button>
        </Col>
        <Col className="text-right">
          Now total
          <StatsValue value={change}>
            {total.toLocaleString()} EUR /{" "}
            {(total - totalSpent).toLocaleString()} EUR
          </StatsValue>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
