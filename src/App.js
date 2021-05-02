import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./App.css";
import CoinPair from "./CoinPair";
import NewTransactionModal from "./NewTransactionModal";
import { StatsValue } from "./styles";
import { fetchLatestPrice } from "./utils";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const local = window.localStorage.getItem("transactions2");
    return local
      ? JSON.parse(local)
      : [
          {
            id: new Date().valueOf(),
            pair: "BTCEUR",
            price: 180.85,
            boughtAt: 44687.113,
          },
        ];
  });
  const [prices, setPrices] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const totalBalance = currentValue - totalSpent || 0;
  const totalChange = (currentValue * 100) / totalSpent - 100;

  const transactionsByPair = transactions.reduce((p, c) => {
    const pairTransactions = p[c.pair] || [];
    pairTransactions.push(c);
    p[c.pair] = pairTransactions;
    return p;
  }, {});

  async function fetchPrices() {
    setLoading(true);
    for await (const pair of Object.keys(transactionsByPair)) {
      const priceResponse = await fetchLatestPrice(pair);
      setPrices((c) => ({ ...c, [pair]: parseFloat(priceResponse.price) }));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPrices();

    window.localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let totalSpent = 0;
    let value = 0;
    for (const [pairName, pairTransactions] of Object.entries(
      transactionsByPair
    )) {
      totalSpent += pairTransactions.reduce((p, c) => p + c.price, 0);
      let hodl = pairTransactions.reduce((p, c) => p + c.price / c.boughtAt, 0);
      value += (prices[pairName] || 0) * hodl;
    }

    setTotalSpent(totalSpent);
    setCurrentValue(value);
  }, [transactionsByPair, prices]);

  function addNewTransaction(transaction) {
    setTransactions([
      ...transactions,
      { ...transaction, id: new Date().valueOf() },
    ]);
  }

  function deleteTransaction(id) {
    setTransactions((t) => t.filter((t) => t.id !== id));
  }

  return (
    <div className="mb-3">
      <div className="bg-white py-3 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="header m-0">Portfolio</h1>
            </Col>
            <Col sm={12} lg={true}>
              <div className="text-left text-md-right mt-3 mt-lg-0">
                <Button
                  onClick={fetchPrices}
                  variant="outline-primary"
                  size="sm"
                >
                  Update prices
                </Button>{" "}
                <NewTransactionModal submit={addNewTransaction} />{" "}
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setIsEdit((e) => !e)}
                >
                  Edit
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="my-3">
          <Col className="text-center">
            Total balance{" "}
            <StatsValue
              value={totalBalance}
              className="d-block d-lg-inline-block"
            >
              {currentValue.toLocaleString()} EUR
            </StatsValue>{" "}
            {totalBalance > 0 ? "up" : "down"} by{" "}
            <span style={{ fontSize: "larger" }}>{totalChange.toFixed(2)}</span>{" "}
            %
          </Col>
        </Row>

        {Object.entries(transactionsByPair).map(
          ([pairName, transactions], i) => (
            <CoinPair
              key={i}
              pairName={pairName}
              transactions={transactions}
              currentPrice={prices[pairName] || 0}
              isEdit={isEdit}
              loading={loading}
              deleteTransaction={deleteTransaction}
            />
          )
        )}
      </Container>
    </div>
  );
}

export default App;
