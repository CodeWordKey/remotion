import fs from 'node:fs';
import type {ClipRegion} from 'remotion/no-react';
import type {Page} from './browser/BrowserPage';
import type {StillImageFormat} from './image-format';
import {startPerfMeasure, stopPerfMeasure} from './perf';

export const screenshotTask = async ({
	format,
	height,
	omitBackground,
	page,
	width,
	path,
	jpegQuality,
	clipRegion,
}: {
	page: Page;
	format: StillImageFormat;
	path?: string;
	jpegQuality?: number;
	omitBackground: boolean;
	width: number;
	height: number;
	clipRegion: ClipRegion | null;
}): Promise<Buffer | string> => {
	const client = page._client();
	const target = page.target();

	const perfTarget = startPerfMeasure('activate-target');

	await client.send('Target.activateTarget', {
		targetId: target._targetId,
	});
	stopPerfMeasure(perfTarget);

	const shouldSetDefaultBackground = omitBackground;
	if (shouldSetDefaultBackground)
		await client.send('Emulation.setDefaultBackgroundColorOverride', {
			color: {r: 0, g: 0, b: 0, a: 0},
		});

	const cap = startPerfMeasure('capture');
	try {
		let result;
		if (format === 'pdf') {
			const res = await client.send('Page.printToPDF', {
				paperWidth: width / 96, // Convert to Inch
				paperHeight: height / 96, // Convert to Inch
				marginTop: 0,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				scale: 1,
				printBackground: true,
			});
			result = res.value;
		} else {
			const {value} = await client.send('Page.captureScreenshot', {
				format,
				quality: jpegQuality,
				clip:
					clipRegion !== null && clipRegion !== 'hide'
						? {
								x: clipRegion.x,
								y: clipRegion.y,
								height: clipRegion.height,
								scale: 1,
								width: clipRegion.width,
							}
						: {
								x: 0,
								y: 0,
								height,
								scale: 1,
								width,
							},
				captureBeyondViewport: true,
				optimizeForSpeed: true,
				// We find that there is a 0.1% framedrop when rendering under memory pressure
				// which can be circumvented by disabling this option on Lambda.
				// To be determined: Is this a problem with Lambda, or the Chrome version
				// we are using on Lambda?
				// We already found out that the problem is not a general Linux problem.
				fromSurface: !process.env.DISABLE_FROM_SURFACE,
			});
			result = value;
		}

		stopPerfMeasure(cap);
		if (shouldSetDefaultBackground)
			await client.send('Emulation.setDefaultBackgroundColorOverride');

		const saveMarker = startPerfMeasure('save');

		const buffer = Buffer.from(result.data, 'base64');
		if (path) await fs.promises.writeFile(path, buffer);
		stopPerfMeasure(saveMarker);
		return buffer;
	} catch (err) {
		if ((err as Error).message.includes('Unable to capture screenshot')) {
			const errMessage = [
				'Could not take a screenshot because Google Chrome ran out of memory or disk space.',
				process?.env?.__RESERVED_IS_INSIDE_REMOTION_LAMBDA
					? 'Deploy a new Lambda function with more memory or disk space.'
					: 'Decrease the concurrency to use less RAM.',
			].join(' ');
			throw new Error(errMessage);
		}

		throw err;
	}
};
