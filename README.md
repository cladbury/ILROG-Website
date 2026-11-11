# ILROG website

Source for the redesigned ilrog.org. Static site built with Astro. Pages are generated from the JSON files in `src/data/`, so most updates are a text edit in one file.

## Updating content

| To change | Edit |
|---|---|
| Team roster, roles, affiliations | `src/data/team.json` (photos in `public/img/team/`) |
| Guidelines | `src/data/guidelines.json` |
| Reading list | `src/data/publications.json` |
| Meetings (upcoming and past) | `src/data/meetings.json` |
| Trials | `src/data/trials.json` |
| News posts | `src/data/posts.json` |
| Contact details, member counts, login links | `src/data/site.json` |
| ILROG-NEXT (mission, leadership, working groups, committees, conference) | `src/data/ilrog-next.json` |

To add an upcoming meeting, add an entry to the `upcoming` list in `meetings.json` with the same fields as a past meeting. The home page and meetings page pick it up automatically.

## ILROG-NEXT

The ILROG-NEXT section (`/ilrog-next/`) is generated from `src/data/ilrog-next.json`. Each entry in `workingGroups` gets its own page at `/ilrog-next/working-groups/<slug>/`. Adding a working group is one new entry in that list. Photos and institutions are pulled automatically from the ILROG team roster when a name matches; people not on the roster show their initials.

## Hiding sections

`src/data/site.json` has a `show` block that switches parts of the site on or off:

- `trainees`, `residentElective`, `ijrobp`: the matching sections on the Resources page, plus their links in the menu, footer and home page.
- `blog`: the Blog menu item and the home page's Latest Blog Posts. The blog pages themselves live in `src/pages/_blog/` (Astro skips folders that start with `_`). To bring the blog back, set `"blog": true` and rename the folder to `src/pages/blog/`.

## Menu

The top menu is defined at the top of `src/layouts/Base.astro`. Items with `children` open as dropdowns (on hover with a mouse, on tap or click otherwise, and with the keyboard). On phones the menu collapses into a "Menu" button with expandable groups. When `src/data/meetings.json` lists an upcoming meeting, a gold announcement bar links to it above the header.

## Running it

```
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production files in dist/
```

## Hosting on GitHub Pages

The repository includes a workflow (`.github/workflows/deploy.yml`) that builds and publishes the site every time changes are pushed to `main`.

### Test address (before launch)

1. Create the repository on GitHub (ideally under an ILROG organization account) and push this folder to it.
2. In the repository, go to Settings > Pages and set Source to "GitHub Actions". The first build runs on the next push, or start it from the Actions tab.
3. The site appears at `https://<account>.github.io/<repository>/`. Links are written as relative paths at build time, so the site works at that address without changes.
4. While `"launched": false` is set in `src/data/site.json`, every page tells search engines not to index it, so the test copy does not compete with the real ilrog.org in Google.

The free GitHub plan publishes Pages only from public repositories. Anyone with the address can see the test site, but nobody will find it through search.

MemberSpace login will not work at the test address. It only runs on ilrog.org.

### Launch on ilrog.org

1. In `src/data/site.json`, change `"launched": false` to `"launched": true`.
2. Add a file `public/CNAME` containing the single line `www.ilrog.org`, then push.
3. In Settings > Pages, confirm the custom domain is `www.ilrog.org` and turn on "Enforce HTTPS" once the certificate is issued.
4. At the domain registrar, change the DNS records: a CNAME record for `www` pointing to `<account>.github.io`, and A records for the bare `ilrog.org` pointing to GitHub's Pages addresses (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153).
5. Keep Squarespace live until the new site loads correctly on ilrog.org, then cancel it.

## Before launch

- Files hosted on Squarespace (`ilrog.org/s/...`: meeting slides, trial protocols, the trainee reading list, the mini-atlas, the rotation goals document, the NCCN PDF) are still linked to the old site. Download them and move them into `public/files/` before Squarespace is cancelled, or those links will break.
- Add redirects from old URLs (for example `/history-objectives` to `/about/`, `/blog-directory/...` to `/blog/...`, `/resources-for-trainees` to `/resources/`).
- MemberSpace: see the section below.

## Content to confirm with ILROG

- Leadership and roster are as listed on the old site. Several entries had no photo (Jessica Brady, Rimpa Basu Achari, Susan Hiniker, Peter Petersen) and several had no credentials.
- Member count (1,523 in 73 countries) comes from the member map image on the old site. That image's legend also says 30 Steering and 60 Council members, while the roster lists 29 and 69.
- Reading list errors carried over from the old site: "EORTC-LYSA-FIL H10" and "UK RAPID Trial" point to the same PubMed record (25901426); "Solitary Plasmacytoma: MDACC Experience" points to the gastric MALT paper (9586910).
- The resident elective page referred to an application form that was not on the old site. The new page asks applicants to email Denise De La Cruz.
- "Ask an expert" was marked as under development. It is now an email request on the contact page.
- Small fixes made during migration: "Leeuqenhoek" to "Leeuwenhoek", "Berthelson" to "Berthelsen", "Bejing" to "Beijing", "Radiaton" to "Radiation", and the footer's "Radiology Oncology" to "Radiation Oncology".

## MemberSpace

The site loads the same MemberSpace install code the Squarespace site uses (subdomain `ilrog`, set in `src/data/site.json`). It is in `src/layouts/Base.astro`, so it runs on every page. Members keep their accounts, plans and billing: MemberSpace stores those, not the website.

What works once the site is live on ilrog.org:
- "Member login" in the header and footer opens the MemberSpace login popup (the same link the current site uses).
- The floating "Members" button in the bottom right (turned on in the ILROG MemberSpace account).
- "Apply for general membership" opens the General Member plan signup.

Steps at launch (in the MemberSpace dashboard, by whoever holds the ILROG MemberSpace login):
1. Customize > Connected Websites: change the platform from Squarespace to Custom HTML. The website address stays https://www.ilrog.org.
2. Check which pages are set as members-only. Any protected page must exist at the same address on the new site, or be re-pointed to its new address.
3. After the DNS switch, click Verify Install, then test login and signup in a private browser window.

Notes:
- MemberSpace only runs on the live domain, so it does not appear in local previews or the claude.ai preview.
- MemberSpace hides protected pages with JavaScript in the visitor's browser, on Squarespace and here alike. Files that must stay private (slides, protocols) are safer uploaded to MemberSpace's own file storage than placed in `public/`.
