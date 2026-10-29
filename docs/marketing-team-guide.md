# Marketing team's guide to Sanity

Use Sanity to update the Alveta homepage without editing code.

## 1. Open the editor

1. Open the Sanity Studio link shared by your developer or project admin.
2. Sign in with your invited account.
3. Open **Alveta Marketing → Landing Page**.
4. Choose the tab for the content you want to change.

If you do not have the Studio link or access, ask your project admin. The hosted Studio URL is not recorded in this repository.

## 2. Find the right tab

| What you want to update | Tab to open |
| --- | --- |
| Google page title, meta description, social image description | **SEO & Sharing** |
| Top banner message and button | **Announcement** |
| Main headline, introduction, prompt placeholder, button text | **Hero & Chatbar** |
| Menu labels | **Navigation** |
| Customer company names | **Customer Logos** |
| Feature titles, descriptions, benefits, buttons | **Features** |
| Featured AI model cards | **Model Spotlights** |
| Comparison text and illustrative amounts | **Subscription Comparison** |
| Pricing heading, button text, labels | **Pricing Copy** |
| Customer quotes, names, portraits | **Testimonials** |
| Questions and answers | **FAQs** |
| Article preview titles, dates, cover images | **Article Previews** |
| Final section headline and buttons | **Closing CTA** |
| Footer text, links, newsletter labels | **Footer** |
| Brand logos and feature artwork | **Images & Logos** |

## 3. Edit your content

**Text:** Click a field and replace the text. Keep headlines and button labels short so they fit on mobile. Headings with two entries display on two lines; leave the second entry empty if you want one line.

**Lists:** Open an item to edit it. Drag items to change their order where available. Some sections have fixed slots, so adding or duplicating items is disabled.

**Images:** In **Images & Logos**, find the matching **Image Location** and use **Replace Image**. For testimonial portraits and article covers, open the item in its own tab. Add **Alternative Text**: a short description of the image. Check the crop before publishing.

**Buttons:** Change **Label** for the button text. Edit **Href** only where available, using an approved destination. Some buttons and menu destinations are fixed by the website.

### Example: change the SEO title and description

1. Open **SEO & Sharing**.
2. Change **Title** to the page title you want in search results.
3. Change **Description** to a short summary of the page.
4. **Social Image Alt** describes the sharing image; it does not replace the image.
5. Review your edits, then publish using the steps below.

## 4. Publish and check

1. Review your changes. **Publish applies the document's pending changes, including edits from other teammates.**
2. Fix any validation errors shown in Studio.
3. Click **Publish**. Saving a draft alone does not update the website.
4. Wait for the website deployment to finish. If automatic deployment is configured, publishing starts it. Otherwise, ask the developer to rebuild and deploy the site.
5. Open [alveta.ai](https://alveta.ai/), refresh, and check the changed section on desktop and mobile. Click any buttons or links you changed.

SEO title and description are page metadata, so they do not change the visible hero headline. Search engines may take time to show updated metadata.

## What needs developer help?

- Actual plan prices, credits/token allowances, available models, billing, and checkout.
- New sections, layout changes, animations, and fixed button destinations.
- Canonical URL and schema markup.
- Full article pages or newsletter signup functionality. Editing their preview text does not add those features.

**Pricing Copy** changes wording only. **Subscription Comparison** amounts are illustrative marketing content; changing them does not change plan prices.

## If something does not look right

| Problem | What to do |
| --- | --- |
| Published edits are not on the live site | Confirm you clicked Publish, then ask the developer whether the latest deployment completed. |
| You cannot edit or publish | Ask the project admin to check your Sanity access. |
| A field is missing or locked | Send the developer the section name and the change you need. |
| A mistake is still a draft | Correct it before publishing. |
| A mistake is already published | Enter the correct content, publish again, and wait for deployment. |
