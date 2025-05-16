/**
 * Sleeps
 * @param seconds
 * @returns
 */
export const sleep = (seconds: number) =>
	new Promise((res) => {
		console.log(`Sleeping for ${seconds} seconds...`);
		setTimeout(res, seconds * 1000);
	});
