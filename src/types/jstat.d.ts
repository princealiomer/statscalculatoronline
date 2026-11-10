declare module "jstat" {
  const jStat: {
    mean(arr: number[]): number;
    median(arr: number[]): number;
    mode(arr: number[]): number | number[];
    variance(arr: number[], flag?: boolean): number;
    stdev(arr: number[], flag?: boolean): number;
    sum(arr: number[]): number;
    min(arr: number[]): number;
    max(arr: number[]): number;
    range(arr: number[]): number;
    quartiles(arr: number[]): number[];
    percentile(arr: number[], k: number, exclusive?: boolean): number;
    corrcoeff(arr1: number[], arr2: number[]): number;
    covariance(arr1: number[], arr2: number[]): number;
    skewness(arr: number[]): number;
    kurtosis(arr: number[]): number;
    normal: {
      pdf(x: number, mean?: number, sd?: number): number;
      cdf(x: number, mean?: number, sd?: number): number;
      inv(p: number, mean?: number, sd?: number): number;
    };
    studentt: {
      pdf(x: number, dof: number): number;
      cdf(x: number, dof: number): number;
      inv(p: number, dof: number): number;
    };
    chisquare: {
      pdf(x: number, dof: number): number;
      cdf(x: number, dof: number): number;
      inv(p: number, dof: number): number;
    };
    centralF: {
      pdf(x: number, df1: number, df2: number): number;
      cdf(x: number, df1: number, df2: number): number;
      inv(p: number, df1: number, df2: number): number;
    };
    binomial: {
      pdf(k: number, n: number, p: number): number;
      cdf(k: number, n: number, p: number): number;
    };
    poisson: {
      pdf(k: number, l: number): number;
      cdf(k: number, l: number): number;
    };
    beta: {
      pdf(x: number, alpha: number, beta: number): number;
      cdf(x: number, alpha: number, beta: number): number;
      inv(p: number, alpha: number, beta: number): number;
    };
    gamma: {
      pdf(x: number, shape: number, scale: number): number;
      cdf(x: number, shape: number, scale: number): number;
      inv(p: number, shape: number, scale: number): number;
    };
    exponential: {
      pdf(x: number, rate: number): number;
      cdf(x: number, rate: number): number;
      inv(p: number, rate: number): number;
    };
    uniform: {
      pdf(x: number, a: number, b: number): number;
      cdf(x: number, a: number, b: number): number;
      inv(p: number, a: number, b: number): number;
    };
    weibull: {
      pdf(x: number, scale: number, shape: number): number;
      cdf(x: number, scale: number, shape: number): number;
      inv(p: number, scale: number, shape: number): number;
    };
    lognormal: {
      pdf(x: number, mu: number, sigma: number): number;
      cdf(x: number, mu: number, sigma: number): number;
      inv(p: number, mu: number, sigma: number): number;
    };
    factorial(n: number): number;
    combination(n: number, k: number): number;
    permutation(n: number, k: number): number;
  };
  export default jStat;
}
