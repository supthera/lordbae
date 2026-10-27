export const siteLinks = [
  { href: "/#collection", label: "Collection" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#inquiry", label: "Inquiry" },
  { href: "/tools", label: "Property Tools" },
] as const;

export const headerLinks = siteLinks.filter(
  (link) => link.href !== "/#collection" && link.href !== "/#philosophy",
);
