const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.resolve(__dirname, "../index.html"),
  "utf-8"
);

describe("HTML structure", () => {
  let document;

  beforeAll(() => {
    document = new DOMParser().parseFromString(html, "text/html");
  });

  describe("head section", () => {
    test("has DOCTYPE declaration", () => {
      expect(html.trimStart().startsWith("<!DOCTYPE html>")).toBe(true);
    });

    test("has lang attribute set to ja", () => {
      expect(document.documentElement.getAttribute("lang")).toBe("ja");
    });

    test("has charset meta tag", () => {
      const charset = document.querySelector('meta[charset="UTF-8"]');
      expect(charset).not.toBeNull();
    });

    test("has viewport meta tag", () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).not.toBeNull();
      expect(viewport.getAttribute("content")).toContain("width=device-width");
    });

    test("has title element", () => {
      const title = document.querySelector("title");
      expect(title).not.toBeNull();
      expect(title.textContent.length).toBeGreaterThan(0);
    });

    test("has meta description", () => {
      const description = document.querySelector('meta[name="description"]');
      expect(description).not.toBeNull();
      expect(description.getAttribute("content").length).toBeGreaterThan(0);
    });

    test("has favicon", () => {
      const favicon = document.querySelector('link[rel="icon"]');
      expect(favicon).not.toBeNull();
    });

    test("loads stylesheet", () => {
      const stylesheet = document.querySelector(
        'link[rel="stylesheet"][href="style.css"]'
      );
      expect(stylesheet).not.toBeNull();
    });
  });

  describe("navigation", () => {
    test("has header element", () => {
      expect(document.querySelector("header")).not.toBeNull();
    });

    test("has nav element", () => {
      expect(document.querySelector("nav")).not.toBeNull();
    });

    test("has logo image", () => {
      const logo = document.querySelector(".logo-img");
      expect(logo).not.toBeNull();
      expect(logo.getAttribute("alt")).toBeTruthy();
    });

    test("has navigation links", () => {
      const navLinks = document.querySelectorAll(".nav-list a");
      expect(navLinks.length).toBeGreaterThanOrEqual(4);
    });

    test("navigation links have valid href attributes", () => {
      const navLinks = document.querySelectorAll(".nav-list a");
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        expect(href).toBeTruthy();
        expect(href.startsWith("#")).toBe(true);
      });
    });

    test("has hamburger menu for mobile", () => {
      const hamburger = document.querySelector(".hamburger");
      expect(hamburger).not.toBeNull();
    });
  });

  describe("main sections", () => {
    test("has hero section", () => {
      expect(document.querySelector(".hero")).not.toBeNull();
    });

    test("has delivery examples section (car-collection)", () => {
      expect(document.querySelector("#car-collection")).not.toBeNull();
    });

    test("has order sales section", () => {
      expect(document.querySelector("#order-sales")).not.toBeNull();
    });

    test("has about section", () => {
      expect(document.querySelector("#about")).not.toBeNull();
    });

    test("has support section", () => {
      expect(document.querySelector("#support")).not.toBeNull();
    });

    test("has store introduction section", () => {
      expect(document.querySelector("#shop")).not.toBeNull();
    });

    test("has company info section", () => {
      expect(document.querySelector("#company-info")).not.toBeNull();
    });

    test("all nav link targets exist in the page", () => {
      const navLinks = document.querySelectorAll(".nav-list a");
      navLinks.forEach((link) => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId !== "#") {
          const target = document.querySelector(targetId);
          expect(target).not.toBeNull();
        }
      });
    });
  });

  describe("images", () => {
    test("all images have alt attributes", () => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        expect(img.hasAttribute("alt")).toBe(true);
      });
    });

    test("car delivery images exist", () => {
      const carImages = document.querySelectorAll(".car-image-item img");
      expect(carImages.length).toBe(5);
    });

    test("store images exist", () => {
      const storeImages = document.querySelectorAll(".store-images img");
      expect(storeImages.length).toBe(3);
    });
  });

  describe("content integrity", () => {
    test("has correct company name", () => {
      expect(html).toContain("株式会社Beans");
    });

    test("has phone number", () => {
      const phoneLink = document.querySelector('a[href="tel:0154-64-1696"]');
      expect(phoneLink).not.toBeNull();
    });

    test("has address", () => {
      expect(html).toContain("北海道釧路郡釧路町新釧路14-1");
    });

    test("has business hours", () => {
      expect(html).toContain("9:00 - 18:00");
    });

    test("has 4 order flow steps", () => {
      const steps = document.querySelectorAll(".flow-steps .step");
      expect(steps.length).toBe(4);
    });

    test("has 2 support service cards", () => {
      const cards = document.querySelectorAll(".service-card");
      expect(cards.length).toBe(2);
    });

    test("has Google Maps iframe", () => {
      const iframe = document.querySelector(".map-container iframe");
      expect(iframe).not.toBeNull();
    });

    test("has Instagram link", () => {
      const igLink = document.querySelector(
        'a[href="https://www.instagram.com/beans.co.ltd/"]'
      );
      expect(igLink).not.toBeNull();
    });
  });

  describe("footer", () => {
    test("has footer element", () => {
      expect(document.querySelector("footer")).not.toBeNull();
    });

    test("has copyright notice", () => {
      const footer = document.querySelector("footer");
      expect(footer.textContent).toContain("Beans Co., Ltd.");
    });
  });

  describe("SEO", () => {
    test("has only one h1 element", () => {
      const h1s = document.querySelectorAll("h1");
      expect(h1s.length).toBe(1);
    });

    test("heading hierarchy is logical", () => {
      const headings = document.querySelectorAll("h1, h2, h3, h4");
      expect(headings.length).toBeGreaterThan(0);
      // First heading should be h1
      expect(headings[0].tagName).toBe("H1");
    });
  });
});
