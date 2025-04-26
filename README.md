# MAGI-Solana-Benchmark

This project provides a standardized and reproducible benchmark framework for evaluating code generation capabilities in the Solana ecosystem. By covering real on-chain interaction scenarios and multi-dimensional tasks, it systematically assesses the performance of large language models (LLMs) in generating TypeScript code for Solana, including aspects such as functional correctness, security, exception handling, and code readability.

## Key Features

- **Real-world Scenarios**: Covers common development needs such as token trading, DeFi liquidity operations, and contract interactions.
- **Multi-level Tasks**: Ranges from basic single-step transactions to complex multi-contract composite operations, thoroughly testing model capabilities.
- **Unified Testing Standards**: Each task includes clear input/output specifications, function signatures, and automated test cases.
- **Automated Evaluation**: Uses CI pipelines and quantitative metrics (e.g., test pass rates, error type statistics, iteration counts) to compare different models/systems.

## Significant Improvement with MAGI System

Experimental results show that integrating the MAGI System’s multi-round iteration and voting correction mechanism into the Solana code generation agent significantly improves the single-pass success rate. Specifically:

- For simple functions (such as token purchase), direct calls to models like GPT-4 already achieve high pass rates, but traditional models often fail on complex tasks involving slippage, fee calculation, or cross-contract queries.
- MAGI System quickly locates and fixes initial generation errors through multi-round generation and automatic correction, resulting in a much higher final pass rate compared to single-round generation.
- For detailed comparison data and error type distributions, please refer to the experiment section in `intro.md`.

## Reproduction Steps

All experiment-related **task descriptions and reproduction instructions** are included as Markdown files in the `samples/` directory (not source code). The actual implementation code and test scripts can be found in the `src/` and `test/` directories. To reproduce key experiments:

1. Read the relevant Markdown files in the `samples/` directory for detailed task descriptions and experiment protocols (e.g., `pumpfun.md`).
2. Review and run the corresponding TypeScript source code in the `src/` directory and test cases in the `test/` directory.
3. Compare the generation results of different models/systems and analyze pass rates and error types.

## References

- For detailed design and experimental analysis, see [`intro.md`](./intro.md)
- Solana Official Docs: [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- Anchor Framework: [Anchor Book](https://www.anchor-lang.com/docs)
