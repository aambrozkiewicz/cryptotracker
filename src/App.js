import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import "./App.css";
import Coin from "./Coin";
import NewTransactionModal, {
  TYPE_BUY,
  TYPE_SELL,
} from "./NewTransactionModal";
import { Footer, SmallLabel, StatsValue } from "./styles";
import { COINPAPRIKA_COIN_ID, fetchCoinpaprika, generateId } from "./utils";
import coinpaprikaLogo from "./img/cp_logo_hor.svg";
import Pullable from "react-pullable";

const STORAGE_KEY = "c15b977dd99332ca8623fbdfb86827e8";

const coinReducer = (transactions) =>
  transactions.reduce((previous, transaction) => {
    const coin = previous[transaction.coin] || {
      name: transaction.coin,
      takeProfit: 0,
      hodl: 0,
      acquisitionCost: 0,
      transactions: [],
    };

    transaction.direction = transaction.type === TYPE_BUY ? 1 : -1;

    if (transaction.type === TYPE_SELL) {
      const cost = coin.transactions
        .filter((t) => t.type === TYPE_BUY)
        .reduce((p, c) => p + c.left, 0);
      const hodl = coin.transactions
        .filter((t) => t.type === TYPE_BUY)
        .reduce((p, c) => p + c.right, 0);
      const hodlProfit = hodl * transaction.rate - cost;
      const ratio = transaction.right / hodl;

      transaction.takeProfit = ratio * hodlProfit;
    } else {
      transaction.takeProfit = 0;
    }

    coin.takeProfit += transaction.takeProfit;
    coin.hodl += transaction.right * transaction.direction;
    coin.acquisitionCost +=
      transaction.left * transaction.direction + transaction.takeProfit;
    coin.transactions.push(transaction);

    return {
      ...previous,
      [transaction.coin]: coin,
    };
  }, {});

const statsReducer = (coins, prices) =>
  Object.values(coins).reduce(
    (p, c) => {
      return {
        value: p.value + c.hodl * (prices[c.name] || 0),
        acquisitionCost: p.acquisitionCost + c.acquisitionCost,
        takeProfit: p.takeProfit + c.takeProfit,
      };
    },
    { value: 0, acquisitionCost: 0, takeProfit: 0 }
  );

function App() {
  const [transactions, setTransactions] = useState(() => {
    const local = window.localStorage.getItem(STORAGE_KEY);

    return local
      ? JSON.parse(local)
      : [
          {
            id: generateId(),
            coin: "ETH",
            type: TYPE_BUY,
            left: 206.94,
            right: 0.06089179198,
            rate: 3398.4876,
          },
        ];
  });
  const [prices, setPrices] = useState({});

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const coins = coinReducer(transactions);
  const { value, acquisitionCost, takeProfit } = statsReducer(coins, prices);

  const profit = value - acquisitionCost;
  const profitPercentage =
    acquisitionCost > 0 ? (value * 100) / acquisitionCost - 100 : 0;

  async function fetchPrices() {
    setLoading(true);
    for await (const pair of Object.keys(coins)) {
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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]); // eslint-disable-line react-hooks/exhaustive-deps

  function addTransaction(transaction) {
    setTransactions([
      ...transactions,
      {
        id: generateId(),
        ...transaction,
      },
    ]);
  }

  function deleteTransaction(id) {
    setTransactions((t) => t.filter((t) => t.id !== id));
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div style={{ paddingBottom: "4rem" }}>
        <div className="bg-white py-3 border-bottom">
          <Container>
            <Row>
              <Col>
                <h2 className="header m-0 d-inline-block">Portfolio</h2>
                {loading && (
                  <Spinner
                    animation="grow"
                    className="ml-1 d-none d-lg-inline-block"
                  />
                )}
              </Col>
              <Col sm={12} lg={true}>
                <div className="text-left text-md-right mt-3 mt-lg-0">
                  <NewTransactionModal submit={addTransaction} coins={coins} />{" "}
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
                    className="d-none d-lg-inline-block"
                  >
                    Update prices
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <Pullable onRefresh={fetchPrices}>
          <Container>
            <Row className="my-3">
              <Col xs={12} lg>
                <SmallLabel>Acquisition Cost</SmallLabel>
                <StatsValue>{acquisitionCost.toLocaleString()} EUR</StatsValue>
              </Col>
              <Col xs={12} lg>
                <SmallLabel>Current Holdings</SmallLabel>
                <StatsValue>{value.toLocaleString()} EUR</StatsValue>
              </Col>
              <Col xs={12} lg>
                <SmallLabel>Realized profit</SmallLabel>
                <StatsValue>{takeProfit.toLocaleString()} EUR</StatsValue>
              </Col>
              <Col xs={12} lg className="text-left text-lg-right">
                <SmallLabel>Profit/Loss</SmallLabel>
                <StatsValue value={profitPercentage}>
                  {profit.toLocaleString()} EUR {profitPercentage.toFixed(2)} %
                </StatsValue>
              </Col>
            </Row>
            <hr />
            {Object.entries(coins).map(([coinName, coin], i) => (
              <Coin
                key={i}
                coin={coin}
                price={prices[coinName] || 0}
                edit={edit}
                deleteTransactionCallback={deleteTransaction}
              />
            ))}
          </Container>
        </Pullable>
      </div>

      <Footer className="text-center">
        <Container>
          <SmallLabel
            className="d-inline-block"
            style={{ textShadow: "2px 2px 4px #fff" }}
          >
            Data provided by
          </SmallLabel>
          <img
            src={coinpaprikaLogo}
            alt="Coinpaprika"
            style={{ width: "100px" }}
          />
        </Container>
      </Footer>
    </div>
  );
}

export default App;
