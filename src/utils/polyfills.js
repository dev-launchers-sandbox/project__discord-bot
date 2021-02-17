// Array.flat()
if (!Array.prototype.flat) {
	Object.defineProperty(Array.prototype, "flat", {
		value: function (depth = 1, stack = []) {
			for (let item of this) {
				if (item instanceof Array && depth > 0) {
					item.flat(depth - 1, stack);
				} else {
					stack.push(item);
				}
			}

			return stack;
		},
	});
}
