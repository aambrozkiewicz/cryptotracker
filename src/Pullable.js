import { useEffect } from "react";
import PullToRefresh from "pulltorefreshjs";

function Pullable({ onRefresh, children }) {
  useEffect(() => {
    PullToRefresh.init({
      onRefresh,
    });

    return () => PullToRefresh.destroyAll();
  });
  return <>{children}</>;
}

export default Pullable;
