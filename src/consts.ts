export const site = {
	name: 'Slug Security',
	short: 'SlugSec',
	tagline: 'The student-run cybersecurity organization at UC Santa Cruz',
	url: 'https://slugsec.ucsc.edu',
	email: 'slugsec@ucsc.edu',
}

export const legal = {
	copyright: `© ${new Date().getFullYear()} Regents of the University of California`,
	nonprofit: 'Operating under The Regents of the University of California, a 501(c)(3) nonprofit (EIN 94-1539563)',
	nonprofitShort: 'Operating under the Regents of UC, a 501(c)(3) nonprofit (EIN 94-1539563)',
}

export const calendar = {
	id: 'c_22ae8fad3e4f450c25a1b706f5c93f57be29c65907f74d57be81942983563e20@group.calendar.google.com',
	addUrl:
		'https://calendar.google.com/calendar/u/0?cid=Y18yMmFlOGZhZDNlNGY0NTBjMjVhMWI3MDZmNWM5M2Y1N2JlMjljNjU5MDdmNzRkNTdiZTgxOTQyOTgzNTYzZTIwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
	icsUrl:
		'https://calendar.google.com/calendar/ical/c_22ae8fad3e4f450c25a1b706f5c93f57be29c65907f74d57be81942983563e20%40group.calendar.google.com/public/basic.ics',
	embedUrl:
		'https://calendar.google.com/calendar/embed?src=c_22ae8fad3e4f450c25a1b706f5c93f57be29c65907f74d57be81942983563e20%40group.calendar.google.com&ctz=America%2FLos_Angeles&mode=MONTH&showTitle=1&showTz=1&showNav=1&showDate=1&showTabs=1&showPrint=0&showCalendars=0',
	timezone: 'America/Los_Angeles',
}

export const links = {
	discord: 'https://discord.gg/NUVZCumQXB',
	github: 'https://github.com/SlugSecurity',
	twitter: 'https://twitter.com/SlugSec',
	instagram: 'https://instagram.com/SlugSec',
	youtube: 'https://youtube.com/@SlugSec',
	ctftime: 'https://ctftime.org/team/228068',
	range: 'https://range.slugsec.club',
	portal: 'https://auth.slugsec.club',
}

export const socials = [
	{ name: 'Discord', href: links.discord, label: 'Join our Discord', icon: 'simple-icons:discord' },
	{ name: 'Email', href: `mailto:${site.email}`, label: 'Email us', icon: 'lucide:mail' },
	{ name: 'Twitter', href: links.twitter, label: 'Follow on X', icon: 'simple-icons:x' },
	{ name: 'Instagram', href: links.instagram, label: 'Follow on Instagram', icon: 'simple-icons:instagram' },
	{ name: 'YouTube', href: links.youtube, label: 'Subscribe on YouTube', icon: 'simple-icons:youtube' },
	{ name: 'GitHub', href: links.github, label: 'View on GitHub', icon: 'simple-icons:github' },
	{ name: 'CTFtime', href: links.ctftime, label: 'CTFtime team', icon: 'lucide:flag' },
] as const

export const nav = [
	{ label: 'Posts', href: '/posts' },
	{ label: 'Events', href: '/events' },
	{ label: 'Highlights', href: '/highlights' },
	{ label: 'Members', href: '/members' },
	{ label: 'About', href: '/about' },
	{ label: 'Join', href: '/join' },
] as const

export const navExternal = [
	{ label: 'Range', href: links.range, title: 'Practice CTFd, spin up challenges' },
	{ label: 'Portal', href: links.portal, title: 'Member auth and services' },
] as const

export const whatWeDo = [
	{
		head: 'Socialize',
		icon: 'lucide:message-circle',
		body: `Our <a href="${links.discord}" class="text-link">Discord</a> is where most of the action happens. Sharing security news, talking about industry events, showing off projects, or getting help on something you're working on. Follow us on <a href="${links.instagram}" class="text-link">Instagram</a> for the fun side.`,
	},
	{
		head: 'Learn',
		icon: 'lucide:graduation-cap',
		body: 'Hands-on workshops and working sessions. We show you a concept, explain why it matters, then let you go free range on a practice environment. Everything runs on our Cyber Range, our club server rack.',
	},
	{
		head: 'Compete',
		icon: 'lucide:trophy',
		body: 'Diverse competitions throughout the year, mostly online, some in-person. CTFs, cyber defense like CCDC, attack/defend like MITRE eCTF. See <a href="/about#competitions" class="text-link">competitions</a> for details.',
	},
	{
		head: 'Club projects',
		icon: 'lucide:wrench',
		body: 'Applied hacking on real stuff. Bug bounties, securing university systems, hacking routers and IP cameras, porting Doom onto handheld scanners, reverse engineering alarm systems with RF hardware.',
	},
] as const

export const sponsors = [
	{
		name: 'Bugcrowd',
		logo: '/_assets/sponsors/Bugcrowd-Logo-Wordmark-Reverse.svg',
		href: 'https://www.bugcrowd.com/',
		aspect: 'wide',
	},
	{
		name: 'National Upcycled Computing Collective',
		logo: '/_assets/sponsors/NUCC.png',
		href: 'https://www.nuccinc.org/',
		aspect: 'wide',
	},
	{
		name: 'Baskin Engineering @ UCSC',
		logo: '/_assets/sponsors/UCSC_BaskinEng_Logo_White_RGB.svg',
		href: 'https://engineering.ucsc.edu/',
		aspect: 'wide',
	},
	{
		name: 'Merrill College @ UCSC',
		logo: '/_assets/sponsors/UC-Seal.png',
		href: 'https://merrill.ucsc.edu/',
		aspect: 'square',
	},
	{
		name: 'Student Union Assembly @ UCSC',
		logo: '/_assets/sponsors/UCSC-SUA.png',
		href: 'https://sua.ucsc.edu/',
		aspect: 'square',
	},
] as const
