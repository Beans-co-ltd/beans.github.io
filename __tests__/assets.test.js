const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(rootDir, "index.html"), "utf-8");

describe("asset files existence", () => {
  const requiredImages = [
    "assets/images/favicon.png",
    "assets/images/logo.png",
    "assets/images/hero.png",
    "assets/images/car_1.jpg",
    "assets/images/car_2.jpg",
    "assets/images/car_3.jpg",
    "assets/images/car_4.jpg",
    "assets/images/car_5.jpg",
    "assets/images/shop_exterior.jpg",
    "assets/images/shop_interior.jpg",
    "assets/images/shop_kids.jpg",
  ];

  test.each(requiredImages)("%s exists", (imagePath) => {
    const fullPath = path.join(rootDir, imagePath);
    expect(fs.existsSync(fullPath)).toBe(true);
  });

  test("style.css exists", () => {
    expect(fs.existsSync(path.join(rootDir, "style.css"))).toBe(true);
  });

  test("script.js exists", () => {
    expect(fs.existsSync(path.join(rootDir, "script.js"))).toBe(true);
  });

  test("index.html exists", () => {
    expect(fs.existsSync(path.join(rootDir, "index.html"))).toBe(true);
  });
});

describe("HTML references local files that exist", () => {
  test("all img src attributes reference existing files", () => {
    const document = new DOMParser().parseFromString(html, "text/html");
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      const src = img.getAttribute("src");
      // Only check local files (not external URLs)
      if (src && !src.startsWith("http") && !src.startsWith("//")) {
        const fullPath = path.join(rootDir, src);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    });
  });

  test("CSS file referenced in HTML exists", () => {
    const document = new DOMParser().parseFromString(html, "text/html");
    const stylesheets = document.querySelectorAll(
      'link[rel="stylesheet"][href]'
    );

    stylesheets.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("//")) {
        const fullPath = path.join(rootDir, href);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    });
  });

  test("JS file referenced in HTML exists", () => {
    const document = new DOMParser().parseFromString(html, "text/html");
    const scripts = document.querySelectorAll("script[src]");

    scripts.forEach((script) => {
      const src = script.getAttribute("src");
      if (src && !src.startsWith("http") && !src.startsWith("//")) {
        const fullPath = path.join(rootDir, src);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    });
  });

  test("favicon referenced in HTML exists", () => {
    const document = new DOMParser().parseFromString(html, "text/html");
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      const href = favicon.getAttribute("href");
      if (href && !href.startsWith("http")) {
        const fullPath = path.join(rootDir, href);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    }
  });

  test("CSS background-image URLs reference existing files", () => {
    const css = fs.readFileSync(path.join(rootDir, "style.css"), "utf-8");
    const urlMatches = css.match(/url\(["']?([^"')]+)["']?\)/g) || [];

    urlMatches.forEach((match) => {
      const url = match.replace(/url\(["']?/, "").replace(/["']?\)/, "");
      if (url && !url.startsWith("http") && !url.startsWith("//") && !url.startsWith("data:")) {
        const fullPath = path.join(rootDir, url);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    });
  });
});
