# OTU Webring

A ring of personal sites from Ontario Tech University students.

🌐 **Live Site**: [otu-ring.com](https://otu-ring.com)

## Join the Ring

Want to add your site to the webring? Follow these steps:

### 1. Fork the Repository

Click the "Fork" button at the top of this page to create your own copy of the repository.

### 2. Add Your Site

Edit `public/js/sites.js` and add your site to the `sites` array:

```javascript
const sites = [
    { name: "Your Name", url: "https://yoursite.com" },
    // ... existing sites
];
```

**Important**: 
- Add your site in alphabetical order by name (or at the end if you prefer)
- Use the full URL with `https://`
- Make sure your site is accessible and working

### 3. Add the Widget to Your Site

Copy the widget code from `public/widget.html` and paste it into your website's footer (or wherever you want it to appear).

The widget will automatically:
- Detect your site's hostname
- Set up the prev/next navigation links
- Link to the webring homepage

### 4. Submit a Pull Request

1. Commit your changes:
   ```bash
   git add public/js/sites.js
   git commit -m "Add [Your Name] to webring"
   ```

2. Push to your fork:
   ```bash
   git push origin main
   ```

3. Open a Pull Request:
   - Go to the [Pull Requests](https://github.com/VinceKLW/otu-webring/pulls) page
   - Click "New Pull Request"
   - Select your fork and branch
   - Add a description of your changes
   - Click "Create Pull Request"

### 5. Wait for Approval

Once your PR is reviewed and approved, it will be merged and your site will be live on the webring!

## Requirements

- Your site must be publicly accessible
- Your site should include the webring widget (from `widget.html`)
- Your site should be a personal website/blog (not a commercial site)

## Questions?

Open an [issue](https://github.com/VinceKLW/otu-webring/issues) if you have any questions or need help!
