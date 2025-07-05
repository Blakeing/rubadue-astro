import "@testing-library/jest-dom";

// Mock ResizeObserver for component tests
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock IntersectionObserver for component tests
global.IntersectionObserver = class IntersectionObserver {
	root = null;
	rootMargin = "";
	thresholds = [];

	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
};
