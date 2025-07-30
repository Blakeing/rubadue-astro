# Litz Wire Calculator - Consolidated Analysis

## Overview

The Litz Wire Calculator is a web-based tool that calculates wire diameters, insulation requirements, and manufacturing capabilities for Litz wire constructions. The application uses four Excel reference files to drive all calculations and validation rules.

## Reference Data Files Analysis

### File 1: AWG Reference_values.csv

**Purpose**: Defines wire size specifications including diameter, copper area, and stranded conductor data.

**Data Coverage**: ✅ **Complete** - All AWG sizes 4-50 have full specifications

**Key Data Points**:
| AWG Size | Diameter (inches) | Copper Area (CMA) | Status |
|----------|-------------------|-------------------|--------|
| 4 | 0.2043 | 41,740 | ✅ Complete |
| 9 | 0.1144 | 13,090 | ✅ Complete |
| 10 | 0.1019 | 10,380 | ✅ Complete |
| 36 | 0.0050 | 25.0 | ✅ Complete |
| 45 | 0.00176 | 3.1 | ✅ Complete |
| 50 | 0.00099 | 0.98 | ✅ Complete |

**Issues Found**: **None** - This file is complete and accurate.

---

### File 2: Magnet Wire_values.csv

**Purpose**: Defines film thickness data for different insulation types (Single, Heavy, Triple, Quadruple).

**Data Coverage Analysis**:

#### Single Film Data
✅ **Complete**: All AWG sizes 4-50 have single film data

#### Heavy Film Data  
✅ **Complete**: All AWG sizes 4-50 have heavy film data

#### Triple Film Data
❌ **Incomplete**: Missing data for AWG 45-50

| AWG Size | Triple Film Thickness | Status |
|----------|----------------------|--------|
| 44 | 0.0015" | ✅ Available |
| 45 | 0.000" | ❌ **MISSING** |
| 46 | 0.000" | ❌ **MISSING** |
| 47 | 0.000" | ❌ **MISSING** |
| 48 | 0.000" | ❌ **MISSING** |
| 49 | 0.000" | ❌ **MISSING** |
| 50 | 0.000" | ❌ **MISSING** |

#### Quadruple Film Data
✅ **Complete**: All AWG sizes 4-50 have quadruple film data

**Business Impact**:
- **AWG 45-50 triple insulation**: Calculator shows "N/A" due to missing data
- **Customer experience**: Cannot get specifications for these wire constructions
- **Sales impact**: Potential lost sales for AWG 45-50 triple insulation

---

### File 3: Max Ends Single Op_values.csv

**Purpose**: Defines maximum strand counts that can be manufactured for each AWG size.

**Data Coverage Analysis**:
❌ **Major gaps**: Missing data for AWG 4-9, zero values for AWG 10-35

| AWG Size | Max Strands | Status | Business Impact |
|----------|-------------|--------|-----------------|
| 4 | **MISSING** | ❌ No data | Cannot validate strand counts |
| 5 | **MISSING** | ❌ No data | Cannot validate strand counts |
| 6 | **MISSING** | ❌ No data | Cannot validate strand counts |
| 7 | **MISSING** | ❌ No data | Cannot validate strand counts |
| 8 | **MISSING** | ❌ No data | Cannot validate strand counts |
| 9 | **MISSING** | ❌ No data | Cannot validate strand counts |
| 10 | 0 | ❌ Listed as 0 | Cannot manufacture any strands |
| 11 | 0 | ❌ Listed as 0 | Cannot manufacture any strands |
| 12 | 0 | ❌ Listed as 0 | Cannot manufacture any strands |
| ... | 0 | ❌ Listed as 0 | Cannot manufacture any strands |
| 35 | 0 | ❌ Listed as 0 | Cannot manufacture any strands |
| 36 | 200 | ✅ Valid data | Can validate up to 200 strands |
| 37 | 150 | ✅ Valid data | Can validate up to 150 strands |
| 38 | 120 | ✅ Valid data | Can validate up to 120 strands |
| 39 | 100 | ✅ Valid data | Can validate up to 100 strands |
| 40 | 80 | ✅ Valid data | Can validate up to 80 strands |
| 41 | 60 | ✅ Valid data | Can validate up to 60 strands |
| 42 | 50 | ✅ Valid data | Can validate up to 50 strands |
| 43 | 40 | ✅ Valid data | Can validate up to 40 strands |
| 44 | 30 | ✅ Valid data | Can validate up to 30 strands |
| 45 | 25 | ✅ Valid data | Can validate up to 25 strands |
| 46 | 20 | ✅ Valid data | Can validate up to 20 strands |
| 47 | 15 | ✅ Valid data | Can validate up to 15 strands |
| 48 | 12 | ✅ Valid data | Can validate up to 12 strands |
| 49 | 10 | ✅ Valid data | Can validate up to 10 strands |
| 50 | 8 | ✅ Valid data | Can validate up to 8 strands |

**Business Impact**:
- **AWG 4-9**: "This strand count isn't manufacturable" errors for all constructions
- **AWG 10-35**: Cannot manufacture any strands (listed as 0)
- **Customer experience**: Calculator blocks valid constructions
- **Sales impact**: Significant lost sales opportunities

---

### File 4: Cover Sheet_values.csv

**Purpose**: Defines UL approval rules and wall thickness requirements for different insulation types.

**Data Coverage**: ✅ **Complete** - All formulas and rules are properly defined

**Key Rules Identified**:

#### FEP Insulation Wall Thickness Rules
**Single Insulation (E73)**:
- < 1,939 CMA: 0.002" minimum
- 1,939 - 12,404 CMA: 0.003" minimum  
- 12,405 - 24,977 CMA: 0.010" minimum
- ≥ 24,978 CMA: 0.012" minimum

**Double Insulation (E81)**:
- < 12,405 CMA: 0.002" minimum
- 12,405 - 24,977 CMA: 0.005" minimum
- ≥ 24,978 CMA: 0.006" minimum

**Triple Insulation (E89)**:
- < 12,405 CMA: 0.002" minimum
- ≥ 12,405 CMA: 0.004" minimum

**Business Rule Conflict**:
- **Excel Logic (Current)**: Uses copper area thresholds (12,405 CMA)
- **Business Rules (Desired)**: Uses AWG ranges (40-10 vs 9-4)
- **Conflict**: AWG 9 (13,090 CMA) gets different requirements depending on logic used

---

## Critical Business Questions

### 1. AWG 45-50 Triple Insulation Availability

**Issue**: The calculator shows "N/A" for AWG 45-50 triple insulation because the reference data contains zero values for triple film thickness.

**Question**: Should AWG 45-50 triple insulation be available to customers?

**Options**:
- **Option A**: Provide triple film thickness data for AWG 45-50
- **Option B**: Keep "N/A" behavior (triple insulation not available for these sizes)

**Business Impact**:
- **Option A**: Enables sales for AWG 45-50 triple insulation
- **Option B**: Prevents customer confusion with unavailable products

**Recommendation**: **Option A** - Provide the missing data to enable these sales opportunities.

---

### 2. Maximum Strand Counts for AWG 4-9

**Issue**: The calculator cannot validate strand counts for AWG 4-9 because maximum strand data is missing from the reference files.

**Question**: What are the maximum strand counts that can be manufactured for each AWG size 4-9?

**Required Data**:
| AWG Size | Current Status | Need Maximum Strands |
|----------|----------------|---------------------|
| 4 | Missing data | **Need value** |
| 5 | Missing data | **Need value** |
| 6 | Missing data | **Need value** |
| 7 | Missing data | **Need value** |
| 8 | Missing data | **Need value** |
| 9 | Missing data | **Need value** |

**Business Impact**: Without this data, customers get "not manufacturable" errors for valid constructions.

**Recommendation**: **Immediate action required** - Provide maximum strand counts for each AWG size.

---

### 3. AWG 10-35 Manufacturing Capability

**Issue**: The reference file lists maximum strand counts as 0 for AWG 10-35, which means no strands can be manufactured.

**Question**: Are AWG 10-35 truly not manufacturable, or is this a data error?

**Current Data**:
| AWG Size | Max Strands | Status |
|----------|-------------|--------|
| 10 | 0 | Cannot manufacture any strands |
| 11 | 0 | Cannot manufacture any strands |
| 12 | 0 | Cannot manufacture any strands |
| ... | 0 | Cannot manufacture any strands |
| 35 | 0 | Cannot manufacture any strands |

**Options**:
- **Option A**: Confirm AWG 10-35 are not manufacturable (current behavior is correct)
- **Option B**: Provide actual maximum strand counts for AWG 10-35

**Business Impact**:
- **Option A**: Significant sales restrictions for AWG 10-35
- **Option B**: Enables sales for AWG 10-35 constructions

**Recommendation**: **Option B** - This appears to be a data error. AWG 10-35 should have reasonable maximum strand counts.

---

### 4. FEP UL Approval Logic

**Issue**: The calculator uses copper area thresholds while business rules specify AWG ranges.

**Conflict**:
- **Excel Logic**: Uses 12,405 CMA threshold
- **Business Rules**: Uses AWG ranges (40-10 vs 9-4)

**Specific Conflict**: AWG 9 (13,090 CMA) gets different requirements:
- **Copper area logic**: Requires 0.004" wall thickness
- **AWG range logic**: Requires 0.002" wall thickness

**Question**: Which logic should the calculator use for FEP UL approval?

**Options**:
- **Option A**: Use copper area thresholds (current Excel logic)
- **Option B**: Use AWG ranges (business rules)
- **Option C**: Hybrid approach with fallback

**Business Impact**: Affects UL approval warnings for all FEP constructions.

**Recommendation**: **Option B** - Use AWG ranges as specified in business rules.

---

### 5. Conductor Diameter Limits for AWG 1-4

**Issue**: AWG 1-4 exceed the 0.200" conductor diameter limit for UL approval.

**Data**:
| AWG Size | Diameter | UL Limit | Status |
|----------|----------|----------|--------|
| 4 | 0.2043" | 0.200" | Exceeds limit |
| 3 | 0.2294" | 0.200" | Exceeds limit |
| 2 | 0.2576" | 0.200" | Exceeds limit |
| 1 | 0.2893" | 0.200" | Exceeds limit |

**Question**: Should AWG 1-4 be blocked entirely due to conductor diameter limits?

**Options**:
- **Option A**: Block AWG 1-4 (cannot carry UL approvals)
- **Option B**: Allow AWG 1-4 with UL approval warnings
- **Option C**: Allow AWG 1-4 without UL approval requirements

**Business Impact**: Affects availability of large wire constructions.

**Recommendation**: **Option A** - Block AWG 1-4 to prevent UL approval confusion.

---

## Current Calculation Rules

### Wire Diameter Formula
```
Diameter = √(Number of Strands) × Individual Wire Diameter × Packing Factor
```

### Packing Factors
| Litz Type | Operations | Packing Factor |
|-----------|------------|----------------|
| Type 1 | 1-3 | 1.155 |
| Type 1 | 4 | 1.051 |
| Type 1 | 5 | 1.082 |
| Type 2 | 1 | 1.155 |
| Type 2 | 2-3 | 1.03 |
| Type 2 | 4 | 1.051 |
| Type 2 | 5 | 1.082 |

### Wall Thickness Rules

#### Single Insulation (E73)
- **ETFE**: Minimum 0.0015"
- **PFA**: Minimum 0.0015"
- **FEP**: Varies by copper area
  - < 1,939 CMA: 0.002" minimum
  - 1,939 - 12,404 CMA: 0.003" minimum
  - 12,405 - 24,977 CMA: 0.010" minimum
  - ≥ 24,978 CMA: 0.012" minimum

#### Double Insulation (E81)
- **ETFE**: Minimum 0.001"
- **PFA**: Minimum 0.0015"
- **FEP**: Varies by copper area
  - < 12,405 CMA: 0.002" minimum
  - 12,405 - 24,977 CMA: 0.005" minimum
  - ≥ 24,978 CMA: 0.006" minimum

#### Triple Insulation (E89)
- **ETFE**: Minimum 0.001"
- **PFA**: Minimum 0.0015"
- **FEP**: Varies by copper area
  - < 12,405 CMA: 0.002" minimum
  - ≥ 12,405 CMA: 0.004" minimum

### UL Approval Rules

#### Conductor Diameter Limit
- **Maximum allowed**: 0.200 inches (5.0mm)
- **AWG sizes exceeding limit**: 1, 2, 3, 4

#### Manufacturing Capability Check
- **Minimum copper area**: 9.61 CMA
- **Minimum strands**: 3 strands required

### Strand Count Validation

#### Minimum Requirements
- **Minimum strands**: 3 strands required
- **Validation**: `strand_count >= 3`

#### Divisibility Rules
For multi-operation constructions, strand counts must be divisible by:
- **3 strands** (for 3-strand operations)
- **4 strands** (for 4-strand operations)
- **5 strands** (for 5-strand operations)

---

## Current Application Behavior

### AWG 45-50 Triple Insulation
**Input**: AWG 45-50 with triple insulation selected
**Output**: "N/A" for all measurements (diameters, wall thickness, part number)
**Reason**: Triple film thickness data is 0.000" in reference file

### AWG 4-9 Strand Validation
**Input**: Any strand count for AWG 4-9
**Output**: "This strand count isn't manufacturable with AWG X wire"
**Reason**: Maximum strand data is missing from reference file

### AWG 10-35 Manufacturing
**Input**: Any strand count for AWG 10-35
**Output**: "This strand count isn't manufacturable with AWG X wire"
**Reason**: Maximum strand count is listed as 0 in reference file

### FEP UL Approval Logic
**Current Implementation**: Uses copper area thresholds (12,405 CMA)
**Business Rules Mentioned**: Uses AWG ranges (40-10 vs 9-4)
**Conflict**: AWG 9 (13,090 CMA) gets different requirements
- Copper area logic: Requires 0.004" wall
- AWG range logic: Requires 0.002" wall

---

## Business Impact Analysis

### Current Customer Experience Issues

1. **AWG 45-50 Triple Insulation**: Customers see "N/A" instead of specifications
2. **AWG 4-9 Strand Validation**: Customers get "not manufacturable" errors
3. **AWG 10-35**: No constructions available (listed as 0 strands)
4. **FEP UL Approval**: Inconsistent warnings based on logic used

### Potential Sales Impact

- **AWG 4-9**: Significant lost sales due to validation errors
- **AWG 10-35**: Complete loss of product range if data is incorrect
- **AWG 45-50**: Lost sales for triple insulation if data is missing
- **FEP Constructions**: Customer confusion due to inconsistent UL warnings

### Recommended Timeline

| Week | Action | Owner | Expected Outcome |
|------|--------|-------|------------------|
| 1 | Provide AWG 4-9 max strands | Engineering | Enable strand validation |
| 1 | Clarify AWG 45-50 triple insulation | Product | Enable/disable product offerings |
| 2 | Confirm AWG 10-35 capability | Manufacturing | Enable large product range |
| 2 | Decide FEP UL logic | Product | Align business rules |
| 3 | Update reference files | Engineering | Complete data set |
| 4 | Implement changes | Development | Full functionality |


## File Structure Reference

```
public/litz-design-tool/
├── AWG Reference_values.csv          # Wire specifications
├── Magnet Wire_values.csv            # Film thickness data
├── Max Ends Single Op_values.csv     # Manufacturing limits
└── Cover Sheet_values.csv            # UL approval rules
```

Each file contains the raw data that drives the calculator's calculations and validation rules.

---

## Summary of Data Gaps

### Critical Issues (Blocking Customer Experience)
1. **AWG 4-9**: Missing maximum strand counts
2. **AWG 45-50**: Missing triple film thickness data
3. **AWG 10-35**: Zero maximum strands

### Logic Conflicts (Need Business Clarification)
1. **FEP UL approval**: Copper area vs AWG ranges
2. **AWG 1-4**: Should be blocked due to conductor diameter limits

### Recommended Actions
1. **Immediate**: Provide maximum strand counts for AWG 4-9
2. **Immediate**: Clarify triple film availability for AWG 45-50
3. **High Priority**: Confirm maximum strand counts for AWG 10-35
4. **Medium Priority**: Decide on FEP UL approval logic
5. **Low Priority**: Confirm conductor diameter limits for AWG 1-4