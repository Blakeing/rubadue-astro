// Excel Formula Verification Test
import { calculateLitzConstruction, calculateElectricalProperties, calculateN1Max } from './src/components/forms/product-tools/litz-utils.js';
import { awgOptions, temperatureCoefficients } from './src/components/forms/product-tools/litz-types.js';

console.log('🧪 EXCEL FORMULA VERIFICATION TEST');
console.log('==================================');

// Test configuration from Excel workbook (100 × 40 AWG)
const testConfig = {
  strandCount: 100,
  awgSize: 40,
  temperature: 60,
  frequency: 1200
};

console.log('📋 Test Configuration:', testConfig);

try {
  // Run calculations
  const electrical = calculateElectricalProperties(
    testConfig.strandCount, 
    testConfig.awgSize, 
    testConfig.temperature, 
    testConfig.frequency
  );
  
  const construction = calculateLitzConstruction(
    testConfig.strandCount, 
    testConfig.awgSize
  );
  
  const n1Max = calculateN1Max(
    testConfig.awgSize, 
    testConfig.frequency, 
    testConfig.temperature
  );
  
  console.log('\n📊 CALCULATION RESULTS');
  console.log('======================');
  console.log('Electrical:', {
    totalCMA: electrical.totalCMA,
    equivalentAWG: electrical.equivalentAWG,
    dcResistance: electrical.dcResistance,
    skinDepth: electrical.skinDepth
  });
  
  console.log('Construction:', {
    type: construction.type,
    operations: construction.operations,
    finalStrands: construction.finalStrands,
    isValid: construction.isValid
  });
  
  console.log('N1 Max Analysis:', {
    skinDepthMils: n1Max.skinDepthMils,
    n1Max: n1Max.n1Max,
    strandDiameter: n1Max.strandDiameter
  });
  
  console.log('\n🎯 EXCEL VERIFICATION');
  console.log('=====================');
  
  // Expected values from Excel
  const expected = {
    totalCMA: 961,      // 9.61 × 100 = 961
    equivalentAWG: '21', // Should be AWG 21 with lower bound algorithm
    type: 'Type 2',     // Type 2 for this configuration
    operations: 2       // 100 = 5×20, so 2 operations
  };
  
  const matches = {
    totalCMA: electrical.totalCMA === expected.totalCMA,
    equivalentAWG: electrical.equivalentAWG === expected.equivalentAWG,
    type: construction.type === expected.type,
    operations: construction.operations === expected.operations
  };
  
  console.log('Expected vs Actual:');
  Object.keys(expected).forEach(key => {
    const exp = expected[key];
    const act = key === 'totalCMA' ? electrical.totalCMA : 
               key === 'equivalentAWG' ? electrical.equivalentAWG :
               key === 'type' ? construction.type :
               construction.operations;
    const match = matches[key];
    console.log(`  ${key}: ${exp} vs ${act} ${match ? '✅' : '❌'}`);
  });
  
  const allMatch = Object.values(matches).every(Boolean);
  console.log(`\n🏆 OVERALL: ${allMatch ? '✅ PERFECT EXCEL COMPLIANCE' : '❌ DISCREPANCIES FOUND'}`);
  
  if (allMatch) {
    console.log('\n🎉 SUCCESS: All calculations match Excel exactly!');
    console.log('✓ Total CMA calculation correct');
    console.log('✓ Equivalent AWG lookup correct');  
    console.log('✓ Construction type logic correct');
    console.log('✓ Operations count correct');
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
} 