import jStat from "jstat";

export function zCriticalRows() {
  const alphas = [0.1, 0.05, 0.025, 0.01, 0.005];
  return alphas.map((a) => ({
    alpha: a,
    oneTail: jStat.normal.inv(1 - a, 0, 1),
    twoTail: jStat.normal.inv(1 - a / 2, 0, 1),
  }));
}

export function tCriticalTable() {
  const dfs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 40, 60, 120];
  const alphas = [0.1, 0.05, 0.025, 0.01];
  return dfs.map((df) => ({
    df,
    values: alphas.map((a) => jStat.studentt.inv(1 - a, df)),
  }));
}

export function chiCriticalTable() {
  const dfs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30];
  const alphas = [0.995, 0.99, 0.975, 0.95, 0.9, 0.1, 0.05, 0.025, 0.01];
  return dfs.map((df) => ({
    df,
    values: alphas.map((a) => jStat.chisquare.inv(1 - a, df)),
  }));
}

export function fCriticalTable(alpha = 0.05) {
  const df1s = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
  const df2s = [5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 40, 60, 120];
  return df2s.map((df2) => ({
    df2,
    values: df1s.map((df1) => jStat.centralF.inv(1 - alpha, df1, df2)),
  }));
}
