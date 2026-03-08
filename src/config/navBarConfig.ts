import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: (NavBarLink | LinkPreset)[] = [
		LinkPreset.Home,
		LinkPreset.Archive,
	];

	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}

	if (siteConfig.pages.guestbook) {
		links.push(LinkPreset.Guestbook);
	}

	links.push({
		name: "关于",
		url: "/about/",
		icon: "material-symbols:info",
	});
	links.push({
		name: "GitHub",
		url: "https://github.com/Assute",
		external: true,
		showExternalIcon: false,
		icon: "fa7-brands:github",
	});

	links.push({
		name: "Gitee",
		url: "https://gitee.com/Assute",
		external: true,
		showExternalIcon: false,
		icon: "fa7-brands:gitee",
	});
	links.push({
		name: "链接",
		url: "/links/",
		icon: "material-symbols:link",
		children: [
			...(siteConfig.pages.bangumi
				? [{
					name: "影视计划",
					url: "https://www.ncat22.com/",
					external: true,
					icon: "material-symbols:movie",
					showExternalIcon: true,
				}]
				: []),
			{
				name: "简约图床",
				url: "https://pic.sl.al/",
				external: true,
				icon: "material-symbols:image",
				showExternalIcon: true,
			},
		],
	});

	return { links } as NavBarConfig;
};

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();


