# AliTechGrid International Website

Production static website for `alitechgrid.com`.

## Website purpose

This site presents AliTechGrid's international work in:

- AI strategy and responsible adoption
- Cloud architecture and training
- Educational technology and curriculum modernization
- Faculty development
- Institutional demonstrations and pilots
- ADAPT-UDL sovereign AI platform concept
- Partnerships and professional consulting

## Booking configuration

Do **not** connect the Canadian computer-repair booking page to this site.

A separate international consultation booking page can be created later in Zoho Calendar.

When ready, edit:

`assets/js/site-config.js`

Replace:

`PASTE_INTERNATIONAL_CONSULTATION_LIVE_LINK_HERE`

with the new Zoho consultation Live Link.

Until then, consultation buttons direct visitors to the Contact page.

## GitHub repository

Recommended repository:

`AliTechGridHQ/alitechgrid-com`

Upload all files and folders from this package to the repository root. The initial package intentionally does not include a `CNAME` file; add the custom domain only after the temporary GitHub Pages site works.

## GitHub Pages

1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /(root)
5. Save
6. Test the temporary GitHub Pages URL
7. Then add custom domain: `alitechgrid.com`

## Important before broad public promotion

- Review all public claims and capability wording
- Decide whether to display founder biography and credentials
- Create a separate international consultation booking page
- Confirm public service scope and commercial terms
- Obtain suitable legal/privacy review
- Verify Cloudflare DNS and preserve Zoho email records
