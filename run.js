const Lexer = require("./lexer");
const fs = require("fs");

const code = fs.readFileSync("./codes/code1.ul", "utf-8");



const lexer = new Lexer();

lexer.lex(code);