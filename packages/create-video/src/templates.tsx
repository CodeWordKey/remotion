import React from 'react';

type DynamicTemplate =
	| {
			type: 'video';
			promoVideo: {
				muxId: string;
				width: number;
				height: number;
			};
	  }
	| {
			type: 'image';
			promoBanner: {
				src: string;
				width: number;
				height: number;
			};
	  };

export type Template = {
	shortName: string;
	description: string;
	org: string;
	repoName: string;
	homePageLabel: string;
	longerDescription: React.ReactNode;
	cliId:
		| 'hello-world'
		| 'javascript'
		| 'blank'
		| 'next'
		| 'next-pages-dir'
		| 'remix'
		| 'three'
		| 'still'
		| 'tts'
		| 'google-tts'
		| 'audiogram'
		| 'skia'
		| 'tailwind'
		| 'overlay'
		| 'stargazer'
		| 'tiktok';
	defaultBranch: string;
	featuredOnHomePage: string | null;
} & DynamicTemplate;

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

function truthy<T>(value: T): value is Truthy<T> {
	return Boolean(value);
}

// Note that this page is statically analyzed by extract-articles.mjs
export const FEATURED_TEMPLATES: Template[] = [
	{
		homePageLabel: 'Hello World',
		shortName: 'Hello World',
		org: 'remotion-dev',
		repoName: 'template-helloworld',
		description: 'A "Hello World" starter template',
		longerDescription:
			'A basic template with TypeScript, Prettier and ESLint preconfigured. Our recommended choice for beginners.',
		promoVideo: {
			muxId: 'vKvV6aa7GXGlR01cmpc6J8Zz4Gkj9d2hBSnVYoef00900I',
			height: 1080,
			width: 1920,
		},
		cliId: 'hello-world' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: 'Hello World',
	},
	{
		homePageLabel: 'Next.js (App dir)',
		shortName: 'Next.js (App dir)',
		org: 'remotion-dev',
		repoName: 'template-next-app-dir',
		description: 'SaaS template for video generation apps',
		longerDescription:
			'A SaaS starter kit which has the Remotion Player and rendering via Remotion Lambda built-in. Our recommended choice for people who want to build an app that can generate videos.',
		promoVideo: {
			width: 1280,
			height: 720,
			muxId: 'RufnZIJZh6L1MAaeG02jnXuM9pK96tNuHRxmXHbWqCBI',
		},
		cliId: 'next' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: 'Next.js',
	},
	{
		homePageLabel: 'Next.js (Pages dir)',
		shortName: 'Next.js (Pages dir)',
		org: 'remotion-dev',
		repoName: 'template-next-pages-dir',
		description: 'SaaS template for video generation apps',
		longerDescription:
			'A SaaS starter kit which has the Remotion Player and rendering via Remotion Lambda built-in. Our recommended choice for people who want to build an app that can generate videos.',
		promoVideo: {
			width: 1280,
			height: 720,
			muxId: 'RufnZIJZh6L1MAaeG02jnXuM9pK96tNuHRxmXHbWqCBI',
		},
		cliId: 'next-pages-dir' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},

	{
		homePageLabel: 'Blank',
		shortName: 'Blank',
		description: 'Nothing except an empty canvas',
		org: 'remotion-dev',
		repoName: 'template-empty',
		longerDescription:
			'A template containing nothing but an empty canvas. Recommended for people who already worked with Remotion.',
		promoVideo: {
			muxId: 'JD00x15y859GjqO7C9hpILkrSddGzd55K4lfj02dv8gU4',
			width: 1280,
			height: 720,
		},
		cliId: 'blank' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: 'Blank',
	},
	{
		homePageLabel: 'JavaScript',
		shortName: 'Hello World (JavaScript)',
		org: 'remotion-dev',
		repoName: 'template-helloworld-javascript',
		description: 'The default starter template in plain JS',
		longerDescription:
			'The Hello World template, but in plain JavaScript. Recommended for people who detest TypeScript.',
		promoVideo: {
			muxId: 'dRIuc00f8QWnKedM8GBGPqXJWqU01DPJFgPTHpJgixxas',
			width: 1920,
			height: 1080,
		},
		cliId: 'javascript' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: 'JavaScript',
	},
	{
		homePageLabel: 'Remix',
		shortName: 'Remix',
		org: 'remotion-dev',
		repoName: 'template-remix',
		description: 'Remotion + Remix Starter Kit',
		longerDescription:
			'A software-as-a-service starter kit which has the Remotion Player and rendering via Remotion Lambda built-in. Built with remix.run.',
		promoBanner: {
			width: 1280,
			height: 720,
			src: '/img/remix-template.png',
		},
		cliId: 'remix' as const,
		type: 'image' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: '3D',
		shortName: 'React Three Fiber',
		org: 'remotion-dev',
		repoName: 'template-three',
		description: 'Remotion + React Three Fiber Starter Template',
		longerDescription:
			'A template with a React Three Fiber scene to play around.',
		promoVideo: {
			muxId: 'mN40242xogVDx023lCChyg8JJBLT02Mqu01Pp00rbbk00SL8M',
			width: 1280,
			height: 720,
		},
		cliId: 'three' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Stills',
		shortName: 'Still images',
		org: 'remotion-dev',
		repoName: 'template-still',
		description: 'Dynamic PNG/JPEG template with built-in server',
		longerDescription:
			'A template for creating still images. Includes a built-in HTTP server that can be deployed to Heroku.',
		promoVideo: {
			muxId: 'admEY3QofSXUf01YbLKR8KqoZXhhprTvEZCM9onSo0001o',
			height: 628,
			width: 1200,
		},
		cliId: 'still' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Text-To-Speech (Azure)',
		shortName: 'TTS (Azure)',
		org: 'FelippeChemello',
		repoName: 'Remotion-TTS-Example',
		description: 'Turns text into speech and makes a video',
		longerDescription:
			'A template that turns text into a spoken video. Integrates with Azure Cloud for Speech synthesis.',
		promoVideo: {
			muxId: '8vJJ01lNuFmQCx7n59VILevqQGxRuQHp9a7VBR7B4C8k',
			width: 1920,
			height: 1080,
		},
		cliId: 'tts' as const,
		type: 'video' as const,
		defaultBranch: 'master',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Text-To-Speech (Google)',
		shortName: 'TTS (Google)',
		org: 'thecmdrunner',
		repoName: 'remotion-gtts-template',
		description: 'Turns text into speech and makes a video',
		longerDescription:
			'A template that turns text into a spoken video. Integrates with Firebase for Storage, and Google Cloud for Speech synthesis.',
		promoVideo: {
			muxId: '82dzhGhv3bl3p8LW009cFGd8oltqt6UvxTWdP27202BAY',
			width: 1920,
			height: 1080,
		},
		cliId: 'google-tts' as const,
		type: 'video' as const,
		defaultBranch: 'master',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Audiogram',
		shortName: 'Audiogram',
		org: 'marcusstenbeck',
		repoName: 'remotion-template-audiogram',
		description: 'Text and waveform visualization for podcasts',
		longerDescription:
			'A template that turns podcast snippets into videos that can be posted on Social Media.',
		promoVideo: {
			muxId: 'nqGuji1CJuoPoU3iprRRhiy3HXiQN0201HLyliOg44HOU',
			height: 1080,
			width: 1080,
		},
		cliId: 'audiogram' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Skia',
		shortName: 'Skia',
		org: 'remotion-dev',
		repoName: 'template-skia',
		description: 'React Native Skia starter',
		longerDescription: 'A template with React Native Skia already setup.',
		promoVideo: {
			muxId: 'ecORcc01sP94IsTRGLwngxH4PC1r1kQq6iXpn00HqCIGI',
			height: 1080,
			width: 1920,
		},
		cliId: 'skia' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Tailwind',
		shortName: 'Tailwind',
		org: 'remotion-dev',
		repoName: 'template-tailwind',
		description: 'TypeScript and Tailwind starter',
		longerDescription:
			'A starter template with TypeScript and Tailwind already set up.',
		promoVideo: {
			muxId: 'OAe00WUpvsAyqAVSd4gehDCeWI81cI024RhTs9l2eB48w',
			height: 720,
			width: 1280,
		},
		cliId: 'tailwind' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Overlay',
		shortName: 'Overlay',
		org: 'remotion-dev',
		repoName: 'template-overlay',
		description: 'Overlays for video editing software',
		longerDescription: (
			<span>
				A starter template to create overlays to use in conventional video
				editing software.{' '}
				<a href="/docs/overlay">Read more about creating overlays.</a>
			</span>
		),
		promoVideo: {
			muxId: 'zgy7XK01009y33Vfzhns02cZS00rOyeZ6WaanaxcrDysqmU',
			height: 720,
			width: 1280,
		},
		cliId: 'overlay' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'Stargazer',
		shortName: 'Stargazer',
		org: 'pomber',
		repoName: 'stargazer',
		description: 'Celebrate your repo stars with a video',
		longerDescription:
			'Your repo reached a stars milestone? Celebrate with a video of your stargazers!',
		promoVideo: {
			muxId: 'y9rC1DoQ7rCzzI9TGeUywyTliOVU8xhHTHHZZ2BhM014',
			height: 540,
			width: 960,
		},
		cliId: 'stargazer' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
	{
		homePageLabel: 'TikTok',
		shortName: 'TikTok',
		org: 'remotion-dev',
		repoName: 'template-tiktok',
		description: 'Generate animated word-by-word captions',
		longerDescription:
			'Caption a video of your choice locally with animated word-by-word captions. Automatically installs Whisper.cpp for you and allows you to customize the animation style.',
		promoVideo: {
			muxId: 'BzwCAYgGPqNtLk301tsgWCDvuWVWfEvaO2bIo2lGEd300',
			height: 1920,
			width: 1080,
		},
		cliId: 'tiktok' as const,
		type: 'video' as const,
		defaultBranch: 'main',
		featuredOnHomePage: null,
	},
].filter(truthy);
