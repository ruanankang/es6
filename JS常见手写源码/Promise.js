/**
 * pending => fulfilled
 * pending => rejected
 * 三个回调函数：executor同步回调函数  onResolved异步回调函数  onRejected异步回调函数
 */

const promise = new Promise((resolve, reject) => {
	// executor执行器 同步回调函数 接收两个参数
	console.log(111);
	// 异步操作
	setTimeout(() => {
		// 异步 宏任务队列
		const time = new Date().getTime();
		if (time % 2 === 0) {
			// 成功，执行 resolve(value) 同步
			resolve(`成功，time=${time}`);
			console.log(666);
		} else {
			// 失败，执行 reject(reason) 同步
			reject(`失败，time=${time}`);
		}
	}, 1000);
	console.log(222);
});

console.log(333);

promise
	.then(
		// 成功，将 value 传给 onResolved 异步回调函数 微任务队列
		(value) => {
			// onResolved
			console.log(value);
		},
		// 失败，将 reason 传给 onRejected 异步回调函数 微任务队列
		(reason) => {
			// onRejected
			console.log(reason);
		}
	)
	.catch((error) => {
		// catch是then(undefined, onRejected)语法糖
		console.log(error, "catch");
	});

console.log(444);

/**
 * Promise.resolve(value) 语法糖
 * Promise.reject(reason) 语法糖
 * Promise.prototype.then(onResolved, onRejected)
 * Promise.prototype.catch(onRejected) 语法糖
 */
const p1 = new Promise((resolve, reject) => {
	resolve(1);
});

const p2 = Promise.resolve(1);
const p3 = Promise.reject(1);

p1.then((value) => {
	console.log("onResolved", value);
});
p2.then((value) => {
	console.log("onResolved", value);
});
p3.then(undefined, (reason) => {
	console.log("onRejected", reason);
});
p3.catch((reason) => {
	console.log("onRejected", reason);
});

/**
 * 如何改变promise的状态？
 * 1）resolve(value)：当前promise实例由pending转为fulfilled
 * 2）reject(reason)：当前promise实例由pending转为rejected
 * 3）executor中抛出异常(throw new Error('出错了'))：当前promise实例由pending转为rejected，此时reason就是throw后面的东西
 */

/**
 * 是先指定回调函数，还是先改变promise的状态？
 * 一般情况下，由于 resolve()/reject()/throw 都是在异步操作过程调用的(如请求接口)，而then()是同步的，
 * 所以是先指定的回调函数，再改变promise的状态。但是，这不是说先执行回调函数，因为给then()传递两个异步回调函数都是微任务，不是同步的。
 * 执行回调函数一定是在改变了promise的状态之后，因为此时才拿到value/reason，才能传给回调函数
 */

/**
 * promise.then()返回的新promise对象的状态由谁决定？
 * 由then()指定的回调函数的执行结果决定。
 * 1）如果抛出异常，新promise变为rejected，reason为抛出的异常；
 * 2）如果返回的是另一个新promise，此promise的结果就会成为新promise的结果；
 * 3）如果返回的是非promise的任意值，新promise变为resolved，value为返回值。
 */
new Promise((resolve, reject) => {
	resolve(5);
	// reject(6);
})
	.then(
		(value) => {
			console.log("onResolved", value);
			// return 2;
			// throw new Error('出错了');
			// return Promise.resolve(30);
			// return Promise.reject(50);
		},
		(reason) => {
			console.log("onRejected", reason);
		}
	)
	.then(
		(value) => {
			console.log("onResolved", value);
		},
		(reason) => {
			console.log("onRejected", reason);
		}
	);

/**
 * promise如何串联多个操作任务？
 * 1）promise的then()返回一个新的promise
 * 2）通过then的链式调用串联多个同步/异步任务，异步要用promise封装
 */
new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log("执行异步任务1");
		resolve("value1");
	}, 500);
})
	.then((value) => {
		console.log("异步任务1的value:", value);
		console.log("执行同步任务2");
		return "value2";
	})
	.then((value) => {
		console.log("同步任务2的value:", value);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log("执行异步任务3");
				resolve("value3");
			});
		});
	})
	.then((value) => {
		console.log("异步任务3的value:", value);
	});

/**
 * 如何理解promise的异常传透？
 * 1）当使用promise的then链式调用时，可以在最后指定失败的回调；
 * 2）前面任何操作出现异常，都会传到最后失败的回调中处理 catch()；
 * 以上两点成立的前提是，then()中仅仅指定onResolved(value)回调函数，而不指定onRejected(reason)回调函数。
 * 当then()中只指定onResolved()回调函数时，onRejected()缺省时为 reason => { throw reason } 或者 reason => Promise.reject(reason)
 */

/**
 * 如何中断promise链？
 * 1）当使用promise的then链式调用时，在中间中断，不再调用后面的回调函数
 * 2）办法：在回调函数中返回一个pending状态的promise对象
 */
new Promise((resolve, reject) => {
	resolve(1);
})
	.then((value) => {
		console.log(value);
		// throw 1
		return Promise.reject(1);
	})
	.catch((reason) => {
		console.log(reason);
		// 中断promise链，不再进入后面的then()
		return new Promise(() => {}); // 该promise对象的状态为 pending
	})
	.then((value) => {
		console.log("sdfghjk", value);
	});
