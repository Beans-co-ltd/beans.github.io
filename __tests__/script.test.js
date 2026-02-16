const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.resolve(__dirname, "../index.html"),
  "utf-8"
);

// Mock IntersectionObserver (not available in jsdom)
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();

global.IntersectionObserver = jest.fn((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: jest.fn(),
}));

describe("script.js - DOM interactions", () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html;
    const scriptContent = fs.readFileSync(
      path.resolve(__dirname, "../script.js"),
      "utf-8"
    );
    eval(scriptContent);
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  describe("hamburger menu", () => {
    afterEach(() => {
      // Reset menu state between tests
      const nav = document.querySelector(".nav");
      const hamburger = document.querySelector(".hamburger");
      nav.classList.remove("active");
      hamburger.classList.remove("active");
    });

    test("toggles nav active class on hamburger click", () => {
      const hamburger = document.querySelector(".hamburger");
      const nav = document.querySelector(".nav");

      hamburger.click();
      expect(nav.classList.contains("active")).toBe(true);
      expect(hamburger.classList.contains("active")).toBe(true);

      hamburger.click();
      expect(nav.classList.contains("active")).toBe(false);
      expect(hamburger.classList.contains("active")).toBe(false);
    });

    test("closes menu when nav link is clicked", () => {
      const hamburger = document.querySelector(".hamburger");
      const nav = document.querySelector(".nav");
      const navLink = document.querySelector(".nav-list a");

      // Open menu
      hamburger.click();
      expect(nav.classList.contains("active")).toBe(true);

      // Click nav link
      navLink.click();
      expect(nav.classList.contains("active")).toBe(false);
      expect(hamburger.classList.contains("active")).toBe(false);
    });
  });

  describe("scroll animations", () => {
    test("creates IntersectionObserver with threshold 0.1", () => {
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0.1 })
      );
    });

    test("adds fade-in-up class to section titles", () => {
      const sectionTitles = document.querySelectorAll(".section-title");
      expect(sectionTitles.length).toBeGreaterThan(0);
      sectionTitles.forEach((el) => {
        expect(el.classList.contains("fade-in-up")).toBe(true);
      });
    });

    test("adds fade-in-up class to service cards", () => {
      const cards = document.querySelectorAll(".service-card");
      expect(cards.length).toBeGreaterThan(0);
      cards.forEach((el) => {
        expect(el.classList.contains("fade-in-up")).toBe(true);
      });
    });

    test("adds fade-in-up class to steps", () => {
      const steps = document.querySelectorAll(".step");
      expect(steps.length).toBeGreaterThan(0);
      steps.forEach((el) => {
        expect(el.classList.contains("fade-in-up")).toBe(true);
      });
    });

    test("observes all animation target elements", () => {
      expect(mockObserve).toHaveBeenCalled();

      const expectedSelectors =
        ".section-title, .about-text, .service-card, .step, .contact-container";
      const animationTargetCount =
        document.querySelectorAll(expectedSelectors).length;
      // +1 for the floating CTA observer watching the hero section
      const floatingCtaObserverCount = document.querySelector("#floating-cta") ? 1 : 0;
      expect(mockObserve.mock.calls.length).toBe(animationTargetCount + floatingCtaObserverCount);
    });
  });

  describe("smooth scrolling", () => {
    test("prevents default on anchor clicks", () => {
      const anchor = document.querySelector('a[href="#car-collection"]');
      const event = new Event("click", { bubbles: true, cancelable: true });
      const prevented = !anchor.dispatchEvent(event);
      expect(prevented).toBe(true);
    });

    test("home link calls scrollTo with top 0", () => {
      const spy = jest
        .spyOn(window, "scrollTo")
        .mockImplementation(() => {});
      const homeLink = document.querySelector('a[href="#"]');

      homeLink.click();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 0,
          behavior: "smooth",
        })
      );

      spy.mockRestore();
    });
  });
});
