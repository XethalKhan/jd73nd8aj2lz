#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { ESLint } = require("eslint");

const reportPath = path.resolve(process.cwd(), "reports", "eslint.json");

function toRepositoryPath(filePath) {
  const absolutePath = path.resolve(filePath);
  return path
    .relative(process.cwd(), absolutePath)
    .split(path.sep)
    .join("/");
}

async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["app", "src"]);

  const normalizedResults = results.map((result) => ({
    ...result,
    filePath: toRepositoryPath(result.filePath),
  }));

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    `${JSON.stringify(normalizedResults, null, 2)}\n`,
    "utf8",
  );

  const errorCount = normalizedResults.reduce(
    (total, result) => total + result.errorCount,
    0,
  );
  const warningCount = normalizedResults.reduce(
    (total, result) => total + result.warningCount,
    0,
  );

  console.log(
    `ESLint JSON report written to ${path.relative(process.cwd(), reportPath)} ` +
      `(${errorCount} errors, ${warningCount} warnings).`,
  );

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
