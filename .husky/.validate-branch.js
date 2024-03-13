//import { execSync } from "child_process";
const { execSync } = require("child_process");

// Função para verificar se o nome do branch está de acordo com os padrões
function isValidBranchName(branchName) {
  const pattern = /^(feat\/|fix\/)/;
  return pattern.test(branchName);
}

// Função para obter o nome do branch atual
function getCurrentBranchName() {
  const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  return branchName;
}

// Função principal para validar o nome do branch
function validateBranchName() {
  const branchName = getCurrentBranchName();

  if (branchName.includes("release")) {
    console.error("Commit diretamente na branch release não é permitido.");
    process.exit(1);
  }

  if (branchName === "main") {
    console.error("Commit diretamente na branch main não é permitido.");
    process.exit(1);
  }

  if (!isValidBranchName(branchName)) {
    console.error("O nome do branch não está de acordo com os padrões especificados.");
    process.exit(1);
  }

  console.log("Nome do branch válido.");
}

validateBranchName();
