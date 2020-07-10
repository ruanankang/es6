import {url} from "./config.js";
import slug from "slug";
import md5 from "md5";

// 生成用户实例
export default function User(name, email) {
	return {
		name,
		email
	};
}

// 生成用户网址
export function createURL(name) {
	return `${url}/user/${slug(name)}`;
}

// 生成用户头像，根据用户邮箱
export function gravatar(email) {
	return `https://www.gravatar.com/avatar/${md5(email)}`
}