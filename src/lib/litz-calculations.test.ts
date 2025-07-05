import { describe, it, expect } from "vitest";
import {
	validateStrandCount,
	calculateLitzConstruction,
	calculateBareLitzDiameters,
	calculateTotalCopperAreaCMA,
	calculatePackingFactor,
	calculateTakeUpFactor,
	calculateEquivalentAWG,
} from "./litz-calculations";

describe("Litz Wire Calculations", () => {
	describe("Strand Validation", () => {
		it("should validate 200 strands for AWG 36", () => {
			const result = validateStrandCount(200, 36);
			expect(result.isValid).toBe(true);
			expect(result.breakdown).toContain(200);
			expect(result.message).toContain("Valid");
		});

		it("should validate 150 strands for AWG 30", () => {
			const result = validateStrandCount(150, 30);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("Valid");
		});

		it("should validate strand counts that can be divided down", () => {
			const result = validateStrandCount(1000, 36);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("breaks down to");
			expect(result.breakdown).toContain(1000);
		});

		it("should reject truly invalid strand counts", () => {
			const result = validateStrandCount(67, 36);
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("Invalid");
		});

		it("should handle special rule for AWG 12-22 with 8 or fewer strands", () => {
			const result = validateStrandCount(5, 18);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("special rule for 8 or fewer strands");
		});
	});

	describe("Copper Area Calculations", () => {
		it("should calculate correct CMA for 200 strands AWG 36", () => {
			expect(calculateTotalCopperAreaCMA(200, 36)).toBe(5000);
		});

		it("should calculate correct CMA for 100 strands AWG 30", () => {
			expect(calculateTotalCopperAreaCMA(100, 30)).toBe(10000);
		});
	});

	describe("Packing Factor Calculations", () => {
		it("should return correct packing factor for Type 1", () => {
			expect(calculatePackingFactor("Type 1", 1)).toBe(1.155);
			expect(calculatePackingFactor("Type 1", 2)).toBe(1.155);
			expect(calculatePackingFactor("Type 1", 3)).toBe(1.155);
		});

		it("should return correct packing factor for Type 2", () => {
			expect(calculatePackingFactor("Type 2", 1)).toBe(1.155);
			expect(calculatePackingFactor("Type 2", 2)).toBe(1.236);
			expect(calculatePackingFactor("Type 2", 3)).toBe(1.271);
		});
	});

	describe("Take Up Factor Calculations", () => {
		it("should return correct take up factors", () => {
			expect(calculateTakeUpFactor(1)).toBe(1.01);
			expect(calculateTakeUpFactor(2)).toBe(1.01);
			expect(calculateTakeUpFactor(3)).toBe(1.03);
			expect(calculateTakeUpFactor(4)).toBe(1.051);
			expect(calculateTakeUpFactor(5)).toBe(1.051);
		});
	});

	describe("Bare Litz Diameter Calculations", () => {
		it("should calculate single film diameters for 200 strands of AWG 36", () => {
			const result = calculateBareLitzDiameters(
				200,
				36,
				1.155,
				"MW 79-C",
				"Single",
			);
			expect(result.nom).toBeCloseTo(0.091, 3);
			expect(result.min).toBeCloseTo(0.087, 3);
			expect(result.max).toBeCloseTo(0.095, 3);
			expect(result.partNumber).toContain("L79-200-36-single");
		});

		it("should calculate heavy film diameters for 100 strands of AWG 30", () => {
			const result = calculateBareLitzDiameters(
				100,
				30,
				1.155,
				"MW 80-C",
				"Heavy",
			);
			// sqrt(100) = 10, 10 * 0.0116 * 1.155 = 0.134
			expect(result.nom).toBeCloseTo(0.134, 3);
			expect(result.min).toBeCloseTo(0.131, 3); // 10 * 0.0113 * 1.155
			expect(result.max).toBeCloseTo(0.137, 3); // 10 * 0.0119 * 1.155
			expect(result.partNumber).toContain("L80-100-30-heavy");
		});

		it("should throw error for unavailable film types", () => {
			expect(() => {
				calculateBareLitzDiameters(100, 12, 1.155, "MW 79-C", "Triple");
			}).toThrow("Triple film not available for AWG 12");
		});
	});

	describe("Complete Litz Construction", () => {
		it("should calculate complete construction for valid input", () => {
			const construction = calculateLitzConstruction(
				200,
				36,
				"Type 1",
				"MW 79-C",
			);

			expect(construction.isValid).toBe(true);
			expect(construction.totalStrands).toBe(200);
			expect(construction.wireAWG).toBe(36);
			expect(construction.litzType).toBe("Type 1");
			expect(construction.numberOfOperations).toBe(2);
			expect(construction.packingFactor).toBe(1.155);
			expect(construction.takeUpFactor).toBe(1.01);
			expect(construction.totalCopperAreaCMA).toBe(5000);
			expect(construction.totalCopperAreaMM2).toBeCloseTo(2.534, 3);
			expect(construction.equivalentAWG).toBe("14 AWG");
		});

		it("should handle strand counts that can be divided down", () => {
			const construction = calculateLitzConstruction(
				1000,
				36,
				"Type 1",
				"MW 79-C",
			);

			expect(construction.isValid).toBe(true);
			expect(construction.totalStrands).toBe(1000);
			expect(construction.numberOfOperations).toBe(3);
			expect(construction.totalCopperAreaCMA).toBe(25000);
		});
	});

	describe("Edge Cases", () => {
		it("should handle minimum valid strand counts", () => {
			const result = validateStrandCount(1, 36);
			expect(result.isValid).toBe(true);
		});

		it("should handle maximum AWG values", () => {
			const result = validateStrandCount(50, 50);
			expect(result.isValid).toBe(true); // 50 can be divided down to 10 strands
			expect(result.message).toContain("breaks down to");
		});

		it("should provide nearby valid counts for valid input", () => {
			const result = validateStrandCount(1000, 36);
			expect(result.isValid).toBe(true);
			expect(result.nearbyValid.length).toBeGreaterThan(0);
			expect(result.nearbyValid).toContain(1000);
		});
	});

	describe("Equivalent AWG Calculation", () => {
		it("should match Excel lookup for 5000 CMA (200 strands AWG 36)", () => {
			expect(calculateEquivalentAWG(5000)).toBe("14 AWG");
		});
		it("should return empty string for CMA above range", () => {
			expect(calculateEquivalentAWG(7000)).toBe("");
		});
		it("should return 50 AWG for very small CMA", () => {
			expect(calculateEquivalentAWG(0.5)).toBe("50 AWG");
		});
	});
});
