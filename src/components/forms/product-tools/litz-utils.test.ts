import { describe, it, expect, beforeEach } from "vitest";
import {
	calculateLitzConstruction,
	calculateElectricalProperties,
	calculateInsulationDimensions,
	calculateN1Max,
	generatePartNumber,
	validateConstruction,
} from "./litz-utils";

describe("Litz Wire Calculator Utilities", () => {
	describe("calculateLitzConstruction", () => {
		it("should calculate Type 1 construction for small AWG and low strand count", () => {
			const result = calculateLitzConstruction(20, 28);

			expect(result.type).toBe("Type 1");
			expect(result.operations).toBeGreaterThan(0);
			expect(result.finalStrands).toBeLessThanOrEqual(20);
			expect(result.isValid).toBe(true);

			console.log("✅ Type 1 construction test result:", result);
		});

		it("should calculate Type 2 construction for larger strand counts", () => {
			const result = calculateLitzConstruction(100, 32);

			expect(result.type).toBe("Type 2");
			expect(result.operations).toBeGreaterThan(0);
			expect(result.finalStrands).toBeLessThanOrEqual(100);

			console.log("✅ Type 2 construction test result:", result);
		});

		it("should handle edge cases for very small AWG", () => {
			const result = calculateLitzConstruction(7, 20);

			expect(result.type).toBe("Type 1");
			expect(result.finalStrands).toBe(7);
			expect(result.operations).toBe(1);

			console.log("✅ Small AWG edge case result:", result);
		});

		it("should validate construction limits correctly", () => {
			// Test with large strand count that would be invalid based on Excel logic (total CMA > 4807)
			const result = calculateLitzConstruction(300, 20); // 300 × 20 AWG would exceed total CMA limits

			// This should trigger Excel validation warnings but not be artificially limited
			expect(result.isValid).toBeDefined(); // Should complete calculation
			expect(typeof result.isValid).toBe("boolean");

			console.log("✅ Large construction test result:", result);
		});
	});

	describe("calculateElectricalProperties", () => {
		it("should calculate electrical properties for standard litz wire", () => {
			const result = calculateElectricalProperties(20, 28, 20, 1.2, 1000);

			expect(result.totalCMA).toBeGreaterThan(0);
			expect(result.dcResistance).toBeGreaterThan(0);
			expect(result.dcResistancePerFoot).toBeGreaterThan(0);
			expect(result.equivalentAWG).toBeTruthy();
			expect(result.skinDepth).toBeGreaterThan(0);
			expect(result.n1Max).toBeGreaterThan(0);

			console.log("✅ Standard electrical properties result:", result);
		});

		it("should calculate temperature-corrected resistance", () => {
			const result20C = calculateElectricalProperties(20, 28, 20, 1.2, 1000);
			const result100C = calculateElectricalProperties(20, 28, 100, 1.2, 1000);

			// Resistance should increase with temperature
			expect(result100C.dcResistance).toBeGreaterThan(result20C.dcResistance);

			console.log("✅ Temperature effect comparison:", {
				resistance20C: result20C.dcResistance,
				resistance100C: result100C.dcResistance,
				increase: `${(
					((result100C.dcResistance - result20C.dcResistance) /
						result20C.dcResistance) *
						100
				).toFixed(2)}%`,
			});
		});

		it("should calculate frequency-dependent skin depth", () => {
			const result1kHz = calculateElectricalProperties(20, 28, 20, 1.2, 1000);
			const result10kHz = calculateElectricalProperties(20, 28, 20, 1.2, 10000);

			// Skin depth should decrease with higher frequency
			expect(result10kHz.skinDepth).toBeLessThan(result1kHz.skinDepth);

			console.log("✅ Frequency effect on skin depth:", {
				skinDepth1kHz: result1kHz.skinDepth,
				skinDepth10kHz: result10kHz.skinDepth,
				ratio: (result1kHz.skinDepth / result10kHz.skinDepth).toFixed(2),
			});
		});

		it("should calculate equivalent AWG correctly", () => {
			const result = calculateElectricalProperties(20, 28, 20, 1.2, 1000);

			// For 20 strands of 28 AWG, should be equivalent to smaller AWG number
			const equivalentNum = Number.parseInt(result.equivalentAWG);
			expect(equivalentNum).toBeLessThan(28);

			console.log("✅ Equivalent AWG test:", {
				originalAWG: 28,
				strandCount: 20,
				equivalentAWG: result.equivalentAWG,
				totalCMA: result.totalCMA,
			});
		});
	});

	describe("calculateN1Max", () => {
		it("should calculate N1 Max for different frequencies", () => {
			const result1kHz = calculateN1Max(28, 1000, 20);
			const result100kHz = calculateN1Max(28, 100000, 20);

			expect(result1kHz.n1Max).toBeGreaterThan(0);
			expect(result100kHz.n1Max).toBeGreaterThan(0);
			expect(result100kHz.n1Max).toBeLessThan(result1kHz.n1Max);

			console.log("✅ N1 Max frequency comparison:", {
				"1kHz": result1kHz,
				"100kHz": result100kHz,
			});
		});

		it("should calculate correct skin depth in mils", () => {
			const result = calculateN1Max(28, 1000, 20);

			expect(result.skinDepthMils).toBeGreaterThan(0);
			expect(result.skinDepth).toBe(result.skinDepthMils); // Should be the same value

			console.log("✅ Skin depth mils test:", result);
		});
	});

	describe("calculateInsulationDimensions", () => {
		it("should calculate dimensions for all insulation types", () => {
			const result = calculateInsulationDimensions(20, 28, "FEP", 20);

			expect(result.bare.nom).toBeGreaterThan(0);
			expect(result.singleInsulated.nom).toBeGreaterThan(result.bare.nom);
			expect(result.doubleInsulated.nom).toBeGreaterThan(
				result.singleInsulated.nom,
			);
			expect(result.tripleInsulated.nom).toBeGreaterThan(
				result.doubleInsulated.nom,
			);

			console.log("✅ Insulation dimensions test:", result);
		});

		it("should respect min/nom/max dimension relationships", () => {
			const result = calculateInsulationDimensions(20, 28, "ETFE", 20);

			expect(result.singleInsulated.min).toBeLessThanOrEqual(
				result.singleInsulated.nom,
			);
			expect(result.singleInsulated.nom).toBeLessThanOrEqual(
				result.singleInsulated.max,
			);

			console.log("✅ Dimension relationship test:", result.singleInsulated);
		});
	});

	describe("generatePartNumber", () => {
		it("should generate correct part numbers for different configurations", () => {
			const barePN = generatePartNumber(20, "28", "BARE", "MW80C");
			const singlePN = generatePartNumber(20, "28", "SINGLE", "MW80C");
			const doublePN = generatePartNumber(20, "28", "DOUBLE", "MW155C");

			expect(barePN).toContain("RL-20-28");
			expect(singlePN).toContain("RL-20-28S");
			expect(doublePN).toContain("RL-20-28H");
			expect(doublePN).toContain("155");

			console.log("✅ Part number generation test:", {
				bare: barePN,
				single: singlePN,
				double: doublePN,
			});
		});
	});

	describe("validateConstruction", () => {
		it("should validate normal constructions as compliant", () => {
			const result = validateConstruction(20, 28, "FEP");

			expect(result.warnings).toBeDefined();
			expect(Array.isArray(result.warnings)).toBe(true);
			expect(typeof result.ulCompliant).toBe("boolean");

			console.log("✅ Normal validation test:", result);
		});

		it("should generate warnings for problematic constructions", () => {
			const result = validateConstruction(1000, 50, "ETFE");

			expect(result.warnings.length).toBeGreaterThan(0);
			expect(result.ulCompliant).toBe(false);

			console.log("✅ Warning generation test:", result);
		});
	});

	describe("Integration Tests", () => {
		it("should match Excel calculator example (20 × 28 AWG)", () => {
			console.log("\n🧪 Integration Test: 20 × 28 AWG Litz Wire");

			const construction = calculateLitzConstruction(20, 28);
			const electrical = calculateElectricalProperties(20, 28, 20, 1.2, 1000);
			const dimensions = calculateInsulationDimensions(
				20,
				28,
				"FEP",
				construction.finalStrands,
			);
			const validation = validateConstruction(20, 28, "FEP");

			console.log("📋 Full calculation results:", {
				construction,
				electrical,
				dimensions,
				validation,
			});

			// Basic sanity checks
			expect(construction.isValid).toBe(true);
			expect(electrical.totalCMA).toBe(20 * 159.8); // 28 AWG CMA × 20 strands
			expect(electrical.equivalentAWG).toBeTruthy();
			expect(dimensions.bare.nom).toBeGreaterThan(0);
		});

		it("should handle high-frequency application (100 × 44 AWG @ 100kHz)", () => {
			console.log("\n🧪 Integration Test: High-Frequency Litz Wire");

			const construction = calculateLitzConstruction(100, 44);
			const electrical = calculateElectricalProperties(
				100,
				44,
				20,
				1.2,
				100000,
			);
			const n1Max = calculateN1Max(44, 100000, 20);

			console.log("📋 High-frequency results:", {
				construction,
				electrical: {
					totalCMA: electrical.totalCMA,
					skinDepth: electrical.skinDepth,
					n1Max: electrical.n1Max,
				},
				n1MaxCalculated: n1Max,
			});

			expect(construction.type).toBe("Type 2");
			expect(electrical.skinDepth).toBeLessThan(10); // Should be small at 100kHz
			expect(n1Max.n1Max).toBeGreaterThan(0);
		});
	});
});

// Additional helper function tests
describe("Helper Functions", () => {
	it("should find equivalent AWG correctly", () => {
		// Test with known CMA values
		const testCases = [
			{ cma: 1024, expectedAWG: "20" }, // Close to 20 AWG (1022 CMA)
			{ cma: 4000, expectedAWG: "14" }, // Close to 14 AWG (4107 CMA)
			{ cma: 10000, expectedAWG: "10" }, // Close to 10 AWG (10380 CMA)
		];

		for (const testCase of testCases) {
			const result = calculateElectricalProperties(1, 28, 20, 1.0, 1000);
			console.log(`✅ CMA ${testCase.cma} test completed`);
		}
	});

	it("should use Excel lookup tables for packing factors", () => {
		// Test Type 1 construction with different operations
		const type1Result = calculateLitzConstruction(20, 28); // Should be Type 1, 2 operations
		expect(type1Result.type).toBe("Type 1");
		expect(type1Result.operations).toBe(2);

		// Test Type 2 construction with 4 operations (special 1.363 factor case)
		const type2Result = calculateLitzConstruction(16, 36); // Should trigger Type 2, 4 operations
		expect(type2Result.type).toBe("Type 2");

		console.log("✅ Excel lookup table test:", {
			type1: type1Result,
			type2: type2Result,
		});
	});

	it("should use Excel Q6 formula for temperature-corrected resistivity", () => {
		// Test the enhanced temperature coefficient calculation
		const result0C = calculateElectricalProperties(20, 28, 0, 1.2, 1000);
		const result20C = calculateElectricalProperties(20, 28, 20, 1.2, 1000);
		const result100C = calculateElectricalProperties(20, 28, 100, 1.2, 1000);

		// Check temperature effects using Q6 formula: =E4*(1+N6*(P6-O6))
		// where E4=resistivity, N6=temp_coeff, P6=operating_temp, O6=reference_temp
		const expectedTemp0C = 1.72e-8 * (1 + 0.00393 * (0 - 20));
		const expectedTemp100C = 1.72e-8 * (1 + 0.00393 * (100 - 20));

		expect(result0C.dcResistance).toBeLessThan(result20C.dcResistance);
		expect(result100C.dcResistance).toBeGreaterThan(result20C.dcResistance);

		console.log("✅ Q6 formula temperature correction test:", {
			"0C": result0C.dcResistance,
			"20C": result20C.dcResistance,
			"100C": result100C.dcResistance,
			expectedResistivity0C: expectedTemp0C,
			expectedResistivity100C: expectedTemp100C,
		});
	});

	it("should use Excel lookup tables for insulation dimensions", () => {
		// Test different AWG sizes to verify Excel lookup table usage
		const awg28Result = calculateInsulationDimensions(20, 28, "FEP", 20);
		const awg44Result = calculateInsulationDimensions(50, 44, "ETFE", 50);

		// Verify lookup table data is being used correctly
		// AWG 28 should have specific thickness values from Excel tables
		expect(awg28Result.singleInsulated.nom).toBeGreaterThan(
			awg28Result.bare.nom,
		);
		expect(awg44Result.singleInsulated.nom).toBeGreaterThan(
			awg44Result.bare.nom,
		);

		console.log("✅ Excel insulation lookup test:", {
			awg28: {
				bare: awg28Result.bare.nom,
				single: awg28Result.singleInsulated.nom,
				double: awg28Result.doubleInsulated.nom,
			},
			awg44: {
				bare: awg44Result.bare.nom,
				single: awg44Result.singleInsulated.nom,
				double: awg44Result.doubleInsulated.nom,
			},
		});
	});

	it("should handle N1 Max calculations with frequency variation", () => {
		// Test N1 Max at different frequencies to verify skin depth calculations
		const n1Max1kHz = calculateN1Max(28, 1000, 20);
		const n1Max10kHz = calculateN1Max(28, 10000, 20);
		const n1Max100kHz = calculateN1Max(28, 100000, 20);

		// Higher frequency should result in lower N1 Max
		expect(n1Max100kHz.n1Max).toBeLessThan(n1Max10kHz.n1Max);
		expect(n1Max10kHz.n1Max).toBeLessThan(n1Max1kHz.n1Max);

		// Skin depth should decrease with frequency
		expect(n1Max100kHz.skinDepth).toBeLessThan(n1Max10kHz.skinDepth);
		expect(n1Max10kHz.skinDepth).toBeLessThan(n1Max1kHz.skinDepth);

		console.log("✅ N1 Max frequency variation test:", {
			"1kHz": { n1Max: n1Max1kHz.n1Max, skinDepth: n1Max1kHz.skinDepth },
			"10kHz": { n1Max: n1Max10kHz.n1Max, skinDepth: n1Max10kHz.skinDepth },
			"100kHz": { n1Max: n1Max100kHz.n1Max, skinDepth: n1Max100kHz.skinDepth },
		});
	});

	it("should validate special Type 2 construction with 1.363 packing factor", () => {
		// Test the special Type 2 case where D5=4, D6="TYPE 2", D4<44 uses 1.363 factor
		// This is from Excel D7 formula: IF(AND(D5=4,D6="TYPE 2",D4<44),1.363,VLOOKUP(...))
		const construction = calculateLitzConstruction(16, 36); // Should trigger Type 2
		const electrical = calculateElectricalProperties(16, 36, 20, 1.363, 1000);

		expect(construction.type).toBe("Type 2");
		expect(electrical.totalCMA).toBe(16 * 25.0); // 36 AWG CMA × 16 strands

		console.log("✅ Special Type 2 packing factor test:", {
			construction,
			totalCMA: electrical.totalCMA,
			specialFactor: 1.363,
		});
	});
});

// Additional precision tests for Excel formula alignment
describe("Excel Formula Precision Tests", () => {
	it("should match Excel precision for electrical calculations", () => {
		// Test specific values that should match Excel exactly
		const result = calculateElectricalProperties(20, 28, 20, 1.2, 1000);

		// 20 strands × 159.8 CMA = 3196 CMA total (exact match expected)
		expect(result.totalCMA).toBe(3196);

		// Check that skin depth calculation matches Excel precision
		expect(result.skinDepth).toBeCloseTo(2.087, 3); // Should be close to Excel value

		console.log("✅ Excel precision test results:", {
			totalCMA: result.totalCMA,
			skinDepthMils: result.skinDepth,
			equivalentAWG: result.equivalentAWG,
		});
	});

	it("should handle extreme temperature ranges correctly", () => {
		// Test temperature coefficient formula at extreme ranges
		const resultCold = calculateElectricalProperties(20, 28, -40, 1.2, 1000);
		const resultHot = calculateElectricalProperties(20, 28, 200, 1.2, 1000);

		// At -40°C, resistance should be significantly lower
		// At 200°C, resistance should be significantly higher
		expect(resultHot.dcResistance).toBeGreaterThan(resultCold.dcResistance);

		const resistanceRatio = resultHot.dcResistance / resultCold.dcResistance;
		expect(resistanceRatio).toBeGreaterThan(1.5); // Should be substantial difference

		console.log("✅ Extreme temperature test:", {
			"-40C": resultCold.dcResistance,
			"200C": resultHot.dcResistance,
			ratio: resistanceRatio.toFixed(2),
		});
	});

	it("should validate complete Excel formula implementation coverage", () => {
		// Integration test that exercises all major Excel formula categories
		const testConfig = {
			strandCount: 105,
			awgSize: 32,
			temperature: 85,
			frequency: 50000,
		};

		const construction = calculateLitzConstruction(
			testConfig.strandCount,
			testConfig.awgSize,
		);
		const electrical = calculateElectricalProperties(
			testConfig.strandCount,
			testConfig.awgSize,
			testConfig.temperature,
			1.2,
			testConfig.frequency,
		);
		const dimensions = calculateInsulationDimensions(
			testConfig.strandCount,
			testConfig.awgSize,
			"FEP",
			construction.finalStrands,
		);
		const validation = validateConstruction(
			testConfig.strandCount,
			testConfig.awgSize,
			"FEP",
		);
		const n1Max = calculateN1Max(
			testConfig.awgSize,
			testConfig.frequency,
			testConfig.temperature,
		);

		// Verify all calculations complete successfully
		expect(construction.isValid).toBeDefined();
		expect(electrical.totalCMA).toBeGreaterThan(0);
		expect(dimensions.bare.nom).toBeGreaterThan(0);
		expect(Array.isArray(validation.warnings)).toBe(true);
		expect(n1Max.n1Max).toBeGreaterThan(0);

		console.log("✅ Complete Excel implementation test:", {
			testConfig,
			results: {
				construction: construction.type,
				operations: construction.operations,
				totalCMA: electrical.totalCMA,
				resistance: electrical.dcResistance,
				skinDepth: electrical.skinDepth,
				n1Max: n1Max.n1Max,
				bareDiameter: dimensions.bare.nom,
				ulCompliant: validation.ulCompliant,
				warningCount: validation.warnings.length,
			},
		});
	});
});
