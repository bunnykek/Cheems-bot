const { Message, MessageMedia } = require('whatsapp-web.js');
const { evaluate } = require('mathjs');
const fs = require("fs");

class Module {
	/** @type {string[]} */
	command = ['!c', '!cnt', '!count'];

	/** @type {string[]} */
	description = [ 'This command is used to increase the previous count, you need to pass an integer or an expression that evaluates to an integer 1 more than previous value (initialized with 0)' ];

	/**
	 * @pram {Client} clinet
	 * @pram {Message} msg
	 * @pram {Object} state
	 */

	async operate (clinet, msg, state) {
		const next_num_file = './modules/count/tmp.txt';

		let msg_string = msg.body;
		let regxmatch = msg_string.match(/^!(c|cnt|count)\s(.+)/);
		let expr = null;
		if (regxmatch) {
			expr = regxmatch[2];
		} else {
			return;
		}

		regxmatch = expr.match(/^(\d|\.|\s|\(|\)|\[|\]|\+|-|\*|\/|\^|%|mod|||&|~|<<|>>>|>>|!|and|or|not|xor|bitOr|bitAnd|bitXor|bitNot|add|subtract|multiply|divide|unaryPlus|unaryMinus|dotMultiply|dotDivide|factorial|pow|dotPow|sqrt|i|pi|e|sin|cos|tan|csc|sec|cot|ctranspose|')+$/);

		if (!regxmatch) {
			msg.reply( "Invalid expression!" );
			return;
		}

		let value = this.eval_expr(expr);

		if (value === null) {
			msg.reply( "Invalid expression!" );
			return;
		}
		
		let next_num = 1;
		if (state.count.next_num) {
			next_num = state.count.next_num;
		}
		else if (fs.existsSync(next_num_file)) {
			try {
				next_num = fs.readFileSync(next_num_file, 'utf8');
				next_num = parseInt(next_num) + 1;
			} catch (err) {
				console.error(`error while fetching ${next_num_file} file for next number: `, err);
				msg.reply( "Sorry couldn't fetch the next number :( try later" );
				return;
			}
		}

		if (value === next_num) {
			try {
				fs.writeFileSync(next_num_file, next_num.toString());
				await msg.react( '✅' );
				state.count.warned = false;
			} catch (err) {
				console.error(`error while writing next number to ${next_num_file} file: `, err);
				msg.reply( `Sorry couldn't update the number :( ${next_num} is still the next number!` );
			}
		} else {
			if (state.count.warned) {
				await msg.react( '❌' );
				msg.reply( `You ruined it at ${next_num}! next number is 1.` );
				state.count.next_num = 1;
				if (fs.existsSync(next_num_file)) fs.rmSync(next_num_file);
			} else {
				await msg.react( '⚠️' );
			}
			state.count.warned = !state.count.warned;
		}
	}

	eval_expr(expr) {
		try {
			return evaluate(expr);
		} catch (err) {
// 			console.log(`error while evaluating count exprssion - ${expr}: `, err);
			return null;
		}
	}
}

module.exports = Module
