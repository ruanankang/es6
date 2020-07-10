/**
 * 自定义Promise函数模块：采用IIFE封装模块
 */
(function (window) {
	/**
	 * @method Promise
	 * @param executor 执行器（同步回调函数）
	 * @description Promise构造函数
	 */
	function Promise(executor) {
		this.status = "pending"; // 给promise对象指定status属性，初始值为pending，可选值有 fulfilled rejected
		this.data = undefined; // 给promise对象指定一个用于存储结果数据的属性
		this.callbacks = []; // 每个元素的结构：{onResolved() {}, onRejected() {}}

		const _this = this; // 保存promise的this指向

		function resolve(value) {
			// 如果状态不为pending，直接结束，确保状态只能由 pending => fulfilled 且状态只能改一次
			if (_this.status !== "pending") return;

			// 将状态改为fulfilled
			_this.status = "fulfilled";

			// 保存value数据
			_this.data = value;

			// 如果有待执行的onResolved回调函数，立即异步执行onResolved回调函数
			if (_this.callbacks.length > 0) {
				// 放入队列中执行所有onResolved回调函数
				setTimeout(() => {
					_this.callbacks.forEach((callbacksObj) => {
						callbacksObj.onResolved();
					});
				}, 0);
			}
		}

		function reject(reason) {
			// 如果状态不为pending，直接结束，确保状态只能由 pending => rejected 且状态只能改一次
			if (_this.status !== "pending") return;

			// 将状态改为rejected
			_this.status = "rejected";

			// 保存reason数据
			_this.data = reason;

			// 如果有待执行的onRejected回调函数，立即异步执行onRejected回调函数
			if (_this.callbacks.length > 0) {
				// 放入队列中执行所有onRejected回调函数
				setTimeout(() => {
					_this.callbacks.forEach((callbacksObj) => {
						callbacksObj.onRejected();
					});
				}, 0);
			}
		}

		// 立即同步执行executor
		try {
			executor(resolve, reject);
		} catch (error) {
			// 如果执行器中抛出异常，则promise状态改为rejected
			reject(error);
		}
	}

	/**
	 * @method then
	 * @param onResolved fulfilled状态的回调函数（异步 微任务队列）
	 * @param onRejected rejected状态的回调函数（异步 微任务队列）
	 * @description Promise的原型方法 then() 指定回调函数
	 * @returns 新的promise对象
	 */
	Promise.prototype.then = function (onResolved, onRejected) {
		const _this = this;

		// 判断是否传入onResolved，实现value向后传递
		onResolved =
			typeof onResolved === "function" ? onResolved : (value) => value;
		// 判断是否传入onRejected，实现异常传透（reason向后专递）
		onRejected =
			typeof onRejected === "function"
				? onRejected
				: (reason) => {
						throw reason;
				  };

		return new Promise((resolve, reject) => {
			/**
			 * 封装 改变返回的新promise状态 的处理函数
			 */
			function handle(callback) {
				try {
					// 当promise状态是fulfilled/rejected，异步执行onResolved/onRejected回调函数
					const result = callback(_this.data);
					// 对于onResolved/onRejected返回的新promise的状态需要分3种情况（即then返回的新promise状态）
					// 1、onResolved/onRejected返回的是promise对象，则then返回的新promise就是onResolved/onRejected返回的promise对象
					if (result instanceof Promise) {
						result.then(resolve, reject);
					} else {
						// 2、onResolved/onRejected返回的不是promise对象，则then返回的新promise状态为fulfilled，value为onResolved/onRejected的返回值
						resolve(result);
					}
				} catch (error) {
					// 3、抛出异常，则then返回的新promise状态为rejected，reason为error
					reject(error);
				}
			}

			// 当promise状态是pending，将回调函数存在this.callbacks中
			if (_this.status === "pending") {
				_this.callbacks.push({
					onResolved() {
						handle(onResolved);
					},
					onRejected() {
						handle(onRejected);
					}
				});
			} else if (_this.status === "fulfilled") {
				setTimeout(() => {
					// 当promise状态是fulfilled，异步执行onResolved回调函数，并改变新promise的状态
					handle(onResolved);
				}, 0);
			} else if (_this.status === "rejected") {
				setTimeout(() => {
					// 当promise状态是rejected，异步执行onRejected回调函数，并改变新promise的状态
					handle(onRejected);
				}, 0);
			}
		});
	};

	/**
	 * @method catch
	 * @param onRejected rejected状态的回调函数（异步 微任务队列）
	 * @description Promise的原型方法 catch()
	 * @returns 新的promise对象
	 */
	Promise.prototype.catch = function (onRejected) {
		this.then(undefined, onRejected);
	};

	/**
	 * @method resolve
	 * @param value fulfilled的值或promise
	 * @description Promise的静态方法 resolve()
	 * @returns 指定value的promise对象，状态可以为rejected/fulfilled
	 */
	Promise.resolve = function (value) {
		// value有两种情况
		return new Promise((resolve, reject) => {
			if (value instanceof Promise) {
				// 1、value是promise对象
				value.then(resolve, reject);
			} else {
				// 2、value是普通值
				resolve(value);
			}
		});
	};

	/**
	 * @method reject
	 * @param reason rejected的原因
	 * @description Promise的静态方法 reject()
	 * @returns 指定reason的promise对象，状态为rejected
	 */
	Promise.reject = function (reason) {
		// 返回一个状态为rejected的promise
		return new Promise((resolve, reject) => {
			reject(reason);
		});
	};

	/**
	 * @method all
	 * @param promisesArr promise类型的数组，也可能元素是普通值
	 * @description Promise的静态方法 all()
	 * @returns 新的promise对象，若promisesArr都为fulfilled，则新的promise对象状态为fulfilled，否则为rejected
	 */
	Promise.all = function (promisesArr) {
		const valuesArr = new Array(promisesArr.length); // 用来保存fulfilled状态promise的value值
		let fulfilledCount = 0; // 记录状态为fulfilled的promise的数目

		return new Promise((resolve, reject) => {
			promisesArr.forEach((promise, index) => {
				// 这里用Promise.resolve对promise进行处理，是考虑到promisesArr的元素不一定都为promise对象
				Promise.resolve(promise).then(
					(value) => {
						fulfilledCount++;
						valuesArr[index] = value;

						// 如果所有的promise都为fulfilled状态，则all()返回的新promise对象的状态为fulfilled
						if (valuesArr.length === fulfilledCount) {
							resolve(valuesArr);
						}
					},
					(reason) => {
						// 只要有一个promise的状态为rejected，则all()返回的新promise对象的状态为rejected
						reject(reason);
					}
				);
			});
		});
	};

	/**
	 * @method race
	 * @param promisesArr promise类型的数组，也可能元素是普通值
	 * @description Promise的静态方法 race()
	 * @returns 新的promise对象，该promise对象的状态和promisesArr中首先改变状态的promise状态一致
	 */
	Promise.race = function (promisesArr) {
		return new Promise((resolve, reject) => {
			promisesArr.forEach((promise) => {
				Promise.resolve(promise).then(
					(value) => {
						resolve(value);
					},
					(reason) => {
						reject(reason);
					}
				);
			});
		});
	};

	// 向外暴露Promise函数
	window.Promise = Promise;
})(window);
