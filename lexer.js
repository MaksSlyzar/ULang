const fs = require('fs');

module.exports = class Lexer{

    lex(code) {
        const result = [];

        let index_liter = -1;
        
        this.solo_liters = ['(', ')', '{', '}', ',', '.', ';'];
        this.multiply_liters = ['+', '-', '/', '*', '='];

        while (index_liter < code.length){
            index_liter++;

            if (code[index_liter] == undefined){
                continue;
            }

            const now_liter = code[index_liter];
            if (now_liter == "\"" || now_liter == "\'"){
                if (result.length > 0){
                    if (result[result.length - 1].type == "string"){
                        if (result[result.length - 1].end == false){
                            result[result.length -1].end = true;
                        }
                    }
                }else if (result.length == 0 || result[result.length - 1].type != "string"){
                    result.push({
                        type: "string",
                        value: "",
                        end: false
                    });
                }

                continue;
            }

            if (result.length > 0) {
                if (code[index_liter] == " " || code[index_liter] == '\n'){
                    result[result.length - 1].end = true;
                    continue;
                }
                
                if (this.solo_liters.includes(code[index_liter])) {
                    result.push({
                        value: code[index_liter],
                        type: "solo_liter",
                        end: true
                    });
                    continue;
                }

                if (this.multiply_liters.includes(code[index_liter])) {
                    if ( result[result.length - 1].end == false && result[result.length - 1].type == "multiply_symbols" ) {
                        result[result.length - 1].value += code[index_liter];
                    }else if ( result[result.length - 1].type != "multiply_symbols" ) {
                        result.push({
                            value: code[index_liter],
                            type: "multiply_symbols",
                            end: false
                        });
                    }
                    
                    continue;
                }


                if (result[result.length - 1].end == false) {
                    result[result.length - 1].value += code[index_liter];
                    continue;
                } else {
                    result.push({
                        type: "word",
                        value: code[index_liter],
                        end: false
                    });

                    continue;
                }
                
            } else if (result.length == 0) {
                result.push({
                    type: "word",
                    value: code[index_liter],
                    end: false
                });
            }
        }

        console.log(result);
        this.GlobalLexer(result);
        fs.writeFileSync('codes/lex_code.json', JSON.stringify(result));
    }

    GlobalLexer(lexed_code) {
        let index_word = -1;

        let result = {
            dist: [

            ]
        };

        createObject(lexed_code);


        function createObject(code){
            let result = [];
            let index_word = -1;
            const brackets = {
                "{": {
                    value: 0,
                    type: "start",
                    val: "block" 
                },
                "}": {
                    value: 0,
                    type: "end",
                    val: "block" 
                },
                "[": {
                    value: 0,
                    type: "start",
                    val: "array" 
                },
                "]": {
                    value: 0,
                    type: "end",
                    val: "array" 
                },
                "(": {
                    value: 0,
                    type: "start",
                    val: "function"
                },
                ")": {
                    value: 0,
                    type: "end",
                    val: "function"
                },
            };

            while (index_word < code.length - 1) {
                index_word += 1;


                const now_word = code[index_word];
                const now_object = {};
                const co_code = [];
                
                if (now_word.type == "word") {
                    if (result.length == 0) {
                        result.push({
                            value: [ now_word.value ],
                            type: "command",
                            args: [],
                            ends: false
                        });
                    }else if (result[result.length - 1].ends == true){
                        result.push({
                            value: [ now_word.value ],
                            type: "command",
                            args: [],
                            ends: false
                        });
                    }else {
                        result[result.length - 1].args.push({
                            value: [ now_word.value ],
                            type: "command",
                            args: [],
                            ends: false
                        });
                    }
                }

                if ( now_word.type == "solo_liter" ) {
                    if (brackets[now_word.value] != undefined) {
                        brackets[now_word.value] += 1;
                        console.log(brackets[now_word.value].val)
                        result[result.length - 1].type = brackets[now_word.value].val;
                    }
                }
            }
            console.log(result);
        }
    }
}