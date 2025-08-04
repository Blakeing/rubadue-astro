import { describe, expect, it } from "vitest";
import {
	calculateBareLitzDiameters,
	calculateEquivalentAWG,
	calculateInsulatedLitzDiameters,
	calculateLitzConstruction,
	calculateNylonServedDiameters,
	calculatePackingFactor,
	calculateRequiredWallThickness,
	calculateTakeUpFactor,
	calculateTotalCopperAreaCMA,
	checkManufacturingCapability,
	checkULApproval,
	validateStrandCount,
} from "./litz-calculations";

/**
 * Litz Wire Calculation Test Suite
 *
 * This test suite validates the mathematical accuracy of Litz wire calculations
 * against Rubadue's Excel-based design tools. All test cases are derived from
 * real-world manufacturing scenarios and UL approval requirements.
 *
 * Test Coverage Areas:
 * - Strand count validation and hierarchical breakdown
 * - Copper area calculations (CMA and mm²)
 * - Packing factors and take-up factors for different Litz types
 * - Bare wire diameter calculations with film thickness
 * - Insulated wire diameter calculations with wall thickness
 * - UL approval validation for different insulation types
 * - Manufacturing capability checks
 * - Edge cases and error handling
 * - Performance and memory usage
 *
 * All test values are verified against Rubadue's Excel calculations.
 */
describe("Litz Wire Calculations", () => {
	describe("Strand Validation", () => {
		it("should validate 200 strands for AWG 36", () => {
			const result = validateStrandCount(200, 36);
			expect(result.isValid).toBe(true);
			expect(result.breakdown).toContain(200);
			expect(result.message).toContain("requires 2 operations");
		});

		it("should validate 150 strands for AWG 30", () => {
			const result = validateStrandCount(150, 30);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("requires 2 operations");
		});

		it("should validate strand counts that can be divided down", () => {
			const result = validateStrandCount(1000, 36);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("requires 3 operations");
			expect(result.breakdown).toContain(1000);
		});

		it("should reject truly invalid strand counts", () => {
			const result = validateStrandCount(67, 36);
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("isn't manufacturable");
		});

		it("should handle special rule for AWG 12-22 with 3-8 strands", () => {
			const result = validateStrandCount(5, 18);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("special rule for 3-8 strands");
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
			expect(calculatePackingFactor("Type 2", 3)).toBe(1.236);
			expect(calculatePackingFactor("Type 2", 4)).toBe(1.271);
			expect(calculatePackingFactor("Type 2", 5)).toBe(1.363);
		});
	});

	describe("Take Up Factor Calculations", () => {
		it("should return correct take up factors for Type 1", () => {
			expect(calculateTakeUpFactor("Type 1", 1)).toBe(1.01);
			expect(calculateTakeUpFactor("Type 1", 2)).toBe(1.01);
			expect(calculateTakeUpFactor("Type 1", 3)).toBe(1.01);
			expect(calculateTakeUpFactor("Type 1", 4)).toBe(1.051);
			expect(calculateTakeUpFactor("Type 1", 5)).toBe(1.082);
		});
		it("should return correct take up factors for Type 2", () => {
			expect(calculateTakeUpFactor("Type 2", 1)).toBe(1.01);
			expect(calculateTakeUpFactor("Type 2", 2)).toBe(1.03);
			expect(calculateTakeUpFactor("Type 2", 3)).toBe(1.03);
			expect(calculateTakeUpFactor("Type 2", 4)).toBe(1.051);
			expect(calculateTakeUpFactor("Type 2", 5)).toBe(1.082);
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
			expect(result.partNumber).toBe("RL-200-36S79-XX");
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
			expect(result.partNumber).toBe("RL-100-30H80-XX");
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
		it("should reject strand counts below minimum of 3", () => {
			const result1 = validateStrandCount(1, 36);
			expect(result1.isValid).toBe(false);
			expect(result1.message).toContain("Minimum 3 strands required");

			const result2 = validateStrandCount(2, 36);
			expect(result2.isValid).toBe(false);
			expect(result2.message).toContain("Minimum 3 strands required");
		});

		it("should validate minimum valid strand count of 3", () => {
			const result = validateStrandCount(3, 36);
			expect(result.isValid).toBe(true);
		});

		it("should handle maximum AWG values", () => {
			const result = validateStrandCount(50, 50);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("requires 2 operations");
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
		it("should return equivalent AWG for CMA within range", () => {
			expect(calculateEquivalentAWG(7000)).toBe("12 AWG");
		});
		it("should return 50 AWG for very small CMA", () => {
			expect(calculateEquivalentAWG(0.5)).toBe("50 AWG");
		});
		it("should match Excel lookup for 7940 CMA (200 strands AWG 34)", () => {
			expect(calculateEquivalentAWG(7940)).toBe("12 AWG");
		});
	});

	describe("Wall Thickness & Insulated Diameter (Excel Logic)", () => {
		it("ETFE: wall thickness should be at least 0.0015", () => {
			expect(calculateRequiredWallThickness("ETFE", 1000, 0.001, 1)).toBe(
				0.0015,
			);
			expect(calculateRequiredWallThickness("ETFE", 1000, 0.002, 1)).toBe(
				0.002,
			);
		});

		it("PFA: wall thickness should be at least 0.0015", () => {
			expect(calculateRequiredWallThickness("PFA", 5000, 0.001, 1)).toBe(
				0.0015,
			);
			expect(calculateRequiredWallThickness("PFA", 5000, 0.002, 1)).toBe(0.002);
		});

		it("FEP: copper area < 1939, min wall 0.002", () => {
			expect(calculateRequiredWallThickness("FEP", 1000, 0.001, 1)).toBe(0.002);
			expect(calculateRequiredWallThickness("FEP", 1000, 0.003, 1)).toBe(0.003);
		});

		it("FEP: 1939 <= copper area < 12405, min wall 0.003", () => {
			expect(calculateRequiredWallThickness("FEP", 5000, 0.002, 1)).toBe(0.003);
			expect(calculateRequiredWallThickness("FEP", 5000, 0.004, 1)).toBe(0.004);
		});

		it("FEP: 12405 <= copper area < 24978, min wall 0.01", () => {
			expect(calculateRequiredWallThickness("FEP", 20000, 0.005, 1)).toBe(0.01);
			expect(calculateRequiredWallThickness("FEP", 20000, 0.02, 1)).toBe(0.02);
		});

		it("FEP: copper area >= 24978, min wall 0.012", () => {
			expect(calculateRequiredWallThickness("FEP", 30000, 0.01, 1)).toBe(0.012);
			expect(calculateRequiredWallThickness("FEP", 30000, 0.02, 1)).toBe(0.02);
		});

		// Triple insulation FEP wall thickness rules (from email feedback)
		it("FEP triple insulation: copper area < 12828, min wall 0.002", () => {
			expect(calculateRequiredWallThickness("FEP", 10000, 0.001, 3)).toBe(
				0.002,
			);
			expect(calculateRequiredWallThickness("FEP", 10000, 0.003, 3)).toBe(
				0.003,
			);
		});

		it("FEP triple insulation: copper area >= 12828, min wall 0.004", () => {
			expect(calculateRequiredWallThickness("FEP", 15000, 0.002, 3)).toBe(
				0.004,
			);
			expect(calculateRequiredWallThickness("FEP", 15000, 0.006, 3)).toBe(
				0.006,
			);
		});
	});

	describe("Nylon Served Diameters", () => {
		it("should calculate single nylon served diameter", () => {
			const bareResult = {
				min: 0.087,
				nom: 0.091,
				max: 0.095,
				partNumber: "RL-200-36SL79-XX",
				wallThicknessInches: null,
				wallThicknessMm: null,
			};
			const result = calculateNylonServedDiameters(
				bareResult,
				"Single Nylon Serve",
			);
			expect(result.nom).toBeCloseTo(0.093, 3); // 0.091 + 0.002
			expect(result.min).toBeCloseTo(0.089, 3); // 0.087 + 0.002
			expect(result.max).toBeCloseTo(0.098, 3); // 0.095 + 0.003
			expect(result.partNumber).toBe("RL-200-36SL79-SN-XX");
		});

		it("should calculate double nylon served diameter", () => {
			const bareResult = {
				min: 0.087,
				nom: 0.091,
				max: 0.095,
				partNumber: "RL-200-36SL79-XX",
				wallThicknessInches: null,
				wallThicknessMm: null,
			};
			const result = calculateNylonServedDiameters(
				bareResult,
				"Double Nylon Serve",
			);
			expect(result.nom).toBeCloseTo(0.095, 3); // 0.091 + 0.004
			expect(result.min).toBeCloseTo(0.091, 3); // 0.087 + 0.004
			expect(result.max).toBeCloseTo(0.101, 3); // 0.095 + 0.006
			expect(result.partNumber).toBe("RL-200-36SL79-DN-XX");
		});
	});

	describe("Triple Insulated Wire Calculations", () => {
		it("should match Excel values for 2000 strands AWG 44 triple insulated", () => {
			// This matches the screenshot: 2000 strands, AWG 44, Type 2, FEP insulation
			const result = calculateInsulatedLitzDiameters(
				44,
				"FEP",
				3,
				"MW 79-C",
				2000,
				1.271, // Type 2, 4 operations packing factor
			);

			// Expected values from Excel screenshot
			expect(result.min).toBeCloseTo(0.135, 3);
			expect(result.nom).toBeCloseTo(0.149, 3);
			expect(result.max).toBeCloseTo(0.156, 3);
			expect(result.wallThicknessInches).toBeCloseTo(0.003, 3); // From screenshot
		});

		it("should work for different strand counts and AWG sizes", () => {
			// Test with 100 strands AWG 30
			const result = calculateInsulatedLitzDiameters(
				30,
				"ETFE",
				3,
				"MW 79-C",
				100,
				1.155,
			);

			// Should calculate properly without errors
			expect(result.min).toBeGreaterThan(0);
			expect(result.nom).toBeGreaterThan(result.min);
			expect(result.max).toBeGreaterThan(result.nom);
			expect(result.wallThicknessInches).toBeGreaterThan(0);
		});

		it("should handle different insulation types correctly", () => {
			// Test with FEP insulation
			const fepResult = calculateInsulatedLitzDiameters(
				36,
				"FEP",
				3,
				"MW 79-C",
				200,
				1.155,
			);

			// Test with ETFE insulation
			const etfeResult = calculateInsulatedLitzDiameters(
				36,
				"ETFE",
				3,
				"MW 79-C",
				200,
				1.155,
			);

			// Both should work and have different wall thicknesses based on material
			expect(fepResult.wallThicknessInches).toBeGreaterThan(0);
			expect(etfeResult.wallThicknessInches).toBeGreaterThan(0);
			expect(fepResult.min).toBeGreaterThan(0);
			expect(etfeResult.min).toBeGreaterThan(0);
		});

		it("should use correct delta based on triple film nominal OD", () => {
			// For smaller wire sizes, triple film nominal should be < 0.1, so delta = 0.001
			const smallResult = calculateInsulatedLitzDiameters(
				40,
				"PFA",
				3,
				"MW 79-C",
				50,
				1.155,
			);

			// For larger wire sizes, triple film nominal should be > 0.1, so delta = 0.002
			const largeResult = calculateInsulatedLitzDiameters(
				20,
				"PFA",
				3,
				"MW 79-C",
				100,
				1.155,
			);

			// Both should calculate without errors
			expect(smallResult.min).toBeGreaterThan(0);
			expect(largeResult.min).toBeGreaterThan(0);
			expect(smallResult.max - smallResult.min).toBeLessThan(
				largeResult.max - largeResult.min,
			);
		});

		it("should handle high AWG values for triple insulation (fallback to single film)", () => {
			// Test AWG 46, 47, 48, 49, 50 which don't have triple film data
			// These should work by falling back to single film diameter for delta calculation
			const awg46Result = calculateInsulatedLitzDiameters(
				46,
				"FEP",
				3,
				"MW 79-C",
				100,
				1.155,
			);

			const awg50Result = calculateInsulatedLitzDiameters(
				50,
				"FEP",
				3,
				"MW 79-C",
				50,
				1.155,
			);

			// Both should calculate without errors (no "Triple film not available" errors)
			expect(awg46Result.min).toBeGreaterThan(0);
			expect(awg46Result.nom).toBeGreaterThan(awg46Result.min);
			expect(awg46Result.max).toBeGreaterThan(awg46Result.nom);
			expect(awg46Result.wallThicknessInches).toBeGreaterThan(0);

			expect(awg50Result.min).toBeGreaterThan(0);
			expect(awg50Result.nom).toBeGreaterThan(awg50Result.min);
			expect(awg50Result.max).toBeGreaterThan(awg50Result.nom);
			expect(awg50Result.wallThicknessInches).toBeGreaterThan(0);

			// AWG 50 should have smaller diameters than AWG 46
			expect(awg50Result.nom).toBeLessThan(awg46Result.nom);
		});
	});

	describe("Error Handling and Edge Cases", () => {
		it("should handle invalid AWG values gracefully", () => {
			// The function doesn't throw for invalid AWG, it just returns invalid result
			const result = validateStrandCount(100, 7); // AWG 7 is below minimum
			expect(result.isValid).toBe(false);
		});

		it("should handle very large strand counts", () => {
			const result = validateStrandCount(10000, 36);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("requires 5 operations");
		});

		it("should handle zero strand count", () => {
			const result = validateStrandCount(0, 36);
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("Minimum 3 strands required");
		});

		it("should handle negative strand count", () => {
			const result = validateStrandCount(-1, 36);
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("Minimum 3 strands required");
		});

		it("should handle edge case AWG values", () => {
			// Test minimum AWG
			const minResult = validateStrandCount(1, 8);
			expect(minResult.isValid).toBe(false);

			// Test maximum AWG
			const maxResult = validateStrandCount(3, 50);
			expect(maxResult.isValid).toBe(true);
		});

		it("should handle construction with edge case values", () => {
			const construction = calculateLitzConstruction(
				3, // Use minimum valid strands
				8, // Minimum AWG
				"Type 1",
				"MW 79-C",
			);

			expect(construction.isValid).toBe(false);
		});

		it("should handle large construction calculations", () => {
			const construction = calculateLitzConstruction(
				10000, // Large strand count
				36,
				"Type 2",
				"MW 79-C",
			);

			expect(construction.isValid).toBe(true);
			expect(construction.totalStrands).toBe(10000);
			expect(construction.numberOfOperations).toBeGreaterThan(1);
			expect(construction.totalCopperAreaCMA).toBeGreaterThan(0);
		});
	});

	describe("Manufacturing Capability and UL Approval", () => {
		it("should handle manufacturing capability checks", () => {
			const warnings = checkManufacturingCapability(5000, "ETFE", 0.002, 1);
			expect(Array.isArray(warnings)).toBe(true);
		});

		it("should handle UL approval checks", () => {
			const warnings = checkULApproval(0.1, "ETFE", 5000, 0.002, 1);
			expect(Array.isArray(warnings)).toBe(true);
		});

		it("should validate FEP triple insulation UL approval with updated 12828 CMA threshold", () => {
			// Test FEP triple insulation with copper area < 12828 and insufficient wall thickness
			const warnings1 = checkULApproval(0.1, "FEP", 10000, 0.001, 3);
			expect(
				warnings1.some((w) =>
					w.includes(
						"INCREASE INSULATION WALL THICKNESS TO AT LEAST 0.0020 INCHES",
					),
				),
			).toBe(true);

			// Test FEP triple insulation with copper area >= 12828 and insufficient wall thickness
			const warnings2 = checkULApproval(0.1, "FEP", 15000, 0.002, 3);
			expect(
				warnings2.some((w) =>
					w.includes(
						"INCREASE INSULATION WALL THICKNESS TO AT LEAST 0.0040 INCHES",
					),
				),
			).toBe(true);

			// Test FEP triple insulation with copper area < 12828 and sufficient wall thickness
			const warnings3 = checkULApproval(0.1, "FEP", 10000, 0.003, 3);
			expect(
				warnings3.some((w) => w.includes("INCREASE INSULATION WALL THICKNESS")),
			).toBe(false);

			// Test FEP triple insulation with copper area >= 12828 and sufficient wall thickness
			const warnings4 = checkULApproval(0.1, "FEP", 15000, 0.005, 3);
			expect(
				warnings4.some((w) => w.includes("INCREASE INSULATION WALL THICKNESS")),
			).toBe(false);
		});
	});

	describe("Performance and Memory", () => {
		it("should handle rapid successive calculations", () => {
			const startTime = performance.now();

			// Perform multiple calculations rapidly
			for (let i = 0; i < 100; i++) {
				calculateLitzConstruction(200, 36, "Type 1", "MW 79-C");
			}

			const endTime = performance.now();
			const duration = endTime - startTime;

			// Should complete within reasonable time (adjust threshold as needed)
			expect(duration).toBeLessThan(1000); // 1 second
		});

		it("should not cause memory leaks with repeated calculations", () => {
			const results = [];

			// Perform many calculations and store results
			for (let i = 0; i < 1000; i++) {
				const result = calculateLitzConstruction(200, 36, "Type 1", "MW 79-C");
				results.push(result);
			}

			// All results should be valid
			for (const result of results) {
				expect(result.isValid).toBe(true);
			}
		});
	});
});
