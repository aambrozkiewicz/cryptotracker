import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./App.css";
import Coin from "./Coin";
import NewTransactionModal, { BUY, PAIRS, SELL } from "./NewTransactionModal";
import { SmallLabel, StatsValue } from "./styles";
import { COINPAPRIKA_COIN_ID, fetchCoinpaprika, generateId } from "./utils";

// NOTE: transactions are sorted in ASC order
const instrumentSelector = (transactions) =>
  transactions.reduce((previous, transaction) => {
    const instrument = previous[transaction.pair.name] || {
      transactions: [],
      totalTakeProfit: 0,
      totalHodl: 0,
    };

    transaction.takeProfit = 0;
    instrument.transactions.push(transaction);

    if (transaction.direction === SELL) {
      const cost = instrument.transactions
        .filter((t) => t.direction === BUY)
        .reduce((p, c) => p + c.price * c.direction, 0);
      const value = instrument.transactions
        .filter((t) => t.direction === BUY)
        .reduce((p, c) => p + c.price / c.rate, 0);
      const exchangeProfit = value * transaction.rate - cost;
      const takeProfitValue = transaction.price / transaction.rate;
      const ratio = takeProfitValue / value;
      transaction.takeProfit = ratio * exchangeProfit;
    }

    instrument.name = transaction.pair.name;
    instrument.totalTakeProfit += transaction.takeProfit;
    instrument.totalHodl +=
      (transaction.price / transaction.rate) * transaction.direction;
    previous[transaction.pair.name] = instrument;

    return previous;
  }, {});

function App() {
  const [transactions, setTransactions] = useState(() => {
    const local = window.localStorage.getItem("transactions");

    return local
      ? JSON.parse(local)
      : [
          {
            id: generateId(),
            pair: PAIRS["BTCEUR"],
            date: "2021-05-01T23:59",
            price: 180.85,
            rate: 44687.113,
            direction: BUY,
          },
        ];
  });
  const [prices, setPrices] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const instruments = instrumentSelector(transactions);
  const valueChange =
    totalSpent > 0 ? (currentValue / totalSpent) * 100 - 100 : 0;
  const totalTakeProfit = Object.values(instruments).reduce(
    (p, instrument) => p + instrument.totalTakeProfit,
    0
  );

  async function fetchPrices() {
    setLoading(true);
    for await (const pair of Object.keys(instruments)) {
      const priceResponse = await fetchCoinpaprika(COINPAPRIKA_COIN_ID[pair]);
      setPrices((c) => ({
        ...c,
        [pair]: parseFloat(priceResponse.quotes["EUR"].price),
      }));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPrices();

    window.localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let totalSpent = 0;
    let totalValue = 0;

    for (const [
      instrumentName,
      { transactions: instrumentTransactions },
    ] of Object.entries(instruments)) {
      totalSpent += instrumentTransactions.reduce(
        (p, c) => p + c.price * c.direction,
        0
      );

      let hodl = instrumentTransactions.reduce(
        (p, c) => p + (c.price * c.direction) / c.rate,
        0
      );
      totalValue += (prices[instrumentName] || 0) * hodl;
    }

    setTotalSpent(totalSpent);
    setCurrentValue(totalValue);
    setProfit(currentValue - totalSpent - totalTakeProfit);
  }, [instruments, prices, totalTakeProfit, currentValue]);

  function addNewTransaction(transaction) {
    setTransactions(
      [...transactions, { ...transaction, id: generateId() }].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    );
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
                <NewTransactionModal submit={addNewTransaction} />{" "}
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setEdit((e) => !e)}
                >
                  Edit
                </Button>{" "}
                <Button
                  onClick={fetchPrices}
                  variant="outline-primary"
                  size="sm"
                >
                  Update prices
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="my-3">
          <Col xs={12} lg>
            <SmallLabel>Acquisition Cost</SmallLabel>
            <StatsValue>{totalSpent.toLocaleString()} EUR</StatsValue>
          </Col>
          <Col xs={12} lg>
            <SmallLabel>Profit/Loss</SmallLabel>
            <StatsValue>{profit.toLocaleString()} EUR</StatsValue>
          </Col>
          <Col xs={12} lg>
            <SmallLabel>Realized profit</SmallLabel>
            <StatsValue>{totalTakeProfit.toLocaleString()} EUR</StatsValue>
          </Col>
          <Col xs={12} lg className="text-left text-lg-right">
            <SmallLabel>Current Holdings</SmallLabel>
            <StatsValue
              value={valueChange}
              className="d-block d-lg-inline-block"
            >
              {currentValue.toLocaleString()} EUR {valueChange.toFixed(2)} %
            </StatsValue>
          </Col>
        </Row>

        <hr />
        {Object.entries(instruments).map(([instrumentName, instrument], i) => (
          <Coin
            key={i}
            instrument={instrument}
            currentPrice={prices[instrumentName] || 0}
            edit={edit}
            loading={loading}
            deleteTransaction={deleteTransaction}
          />
        ))}
      </Container>
    </div>
  );
}

export default App;
