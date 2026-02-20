# NaN Underflow Error Fix

## Problem
The error `underflow (argument="value", value=NaN, code=INVALID_ARGUMENT, version=6.16.0)` was occurring because `NaN` values were being passed to `ethers.parseUnits()` in the frontend.

## Root Causes

1. **Backend returning invalid values**: When `computeReleasableAmount()` fails or returns invalid data, it was being converted to "NaN" string
2. **Frontend not validating input**: `parseTokenAmount()` was accepting NaN, null, undefined, or invalid strings
3. **Missing validation in form inputs**: Numeric inputs weren't validated before parsing

## Fixes Applied

### 1. Frontend `parseTokenAmount()` function

**Before:**
```javascript
export const parseTokenAmount = (amount, decimals = 18) => {
  try {
    return ethers.parseUnits(amount.toString(), decimals);
  } catch {
    return '0';
  }
};
```

**After:**
```javascript
export const parseTokenAmount = (amount, decimals = 18) => {
  try {
    // Handle null, undefined, NaN, empty string
    if (amount === null || amount === undefined || amount === '' || isNaN(amount)) {
      throw new Error('Invalid amount');
    }
    
    // Convert to string and trim
    const amountStr = amount.toString().trim();
    
    // Check if it's a valid number string
    if (amountStr === '' || amountStr === 'NaN' || amountStr === 'Infinity' || amountStr === '-Infinity') {
      throw new Error('Invalid amount string');
    }
    
    // Parse as float first to validate
    const numValue = parseFloat(amountStr);
    if (isNaN(numValue) || numValue < 0) {
      throw new Error('Invalid numeric value');
    }
    
    // Use parseUnits with the validated string
    return ethers.parseUnits(amountStr, decimals);
  } catch (error) {
    console.error('Error parsing token amount:', error, 'Input:', amount);
    throw new Error(`Invalid token amount: ${amount}. Please enter a valid number.`);
  }
};
```

### 2. Frontend `CreateVestingSchedule` component

Added validation for all numeric inputs:
```javascript
// Validate and convert numeric inputs
const cliffDays = parseFloat(formData.cliff);
const durationDays = parseFloat(formData.duration);
const slicePeriodDays = parseFloat(formData.slicePeriodSeconds);

if (isNaN(cliffDays) || cliffDays < 0) {
  throw new Error('Invalid cliff period');
}
if (isNaN(durationDays) || durationDays <= 0) {
  throw new Error('Invalid duration');
}
if (isNaN(slicePeriodDays) || slicePeriodDays <= 0) {
  throw new Error('Invalid slice period');
}
if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
  throw new Error('Invalid amount. Please enter a positive number.');
}
```

### 3. Frontend `VestingSchedulesList` component

Added validation for releasable amount:
```javascript
// Safely parse releasable amount, handling NaN and invalid values
let releasableAmount = schedule.releasable || '0';
if (releasableAmount === 'NaN' || releasableAmount === null || releasableAmount === undefined) {
  releasableAmount = '0';
}
// Ensure it's a valid string representation of a number
const releasableNum = parseFloat(releasableAmount);
if (isNaN(releasableNum) || releasableNum < 0) {
  releasableAmount = '0';
}
```

Also added validation in `handleRelease`:
```javascript
// Validate amount before parsing
if (!amount || amount === '0' || amount === 0 || isNaN(parseFloat(amount))) {
  throw new Error('Invalid amount to release. Please refresh and try again.');
}
```

### 4. Backend `server.js`

Improved error handling for `computeReleasableAmount`:
```javascript
let releasable = "0";
try {
  const releasableResult = await vesting.computeReleasableAmount(scheduleId);
  releasable = releasableResult ? releasableResult.toString() : "0";
} catch (error) {
  console.warn(`Error computing releasable amount for schedule ${i}:`, error.message);
  releasable = "0";
}
```

Also added null checks for all schedule properties:
```javascript
schedules.push({
  scheduleId,
  beneficiary: schedule.beneficiary || "",
  cliff: schedule.cliff ? schedule.cliff.toString() : "0",
  start: schedule.start ? schedule.start.toString() : "0",
  duration: schedule.duration ? schedule.duration.toString() : "0",
  slicePeriodSeconds: schedule.slicePeriodSeconds ? schedule.slicePeriodSeconds.toString() : "0",
  revocable: schedule.revocable || false,
  amountTotal: schedule.amountTotal ? schedule.amountTotal.toString() : "0",
  released: schedule.released ? schedule.released.toString() : "0",
  revoked: schedule.revoked || false,
  releasable: releasable,
});
```

## Testing

After these fixes:
1. ✅ Invalid amounts will show clear error messages instead of NaN errors
2. ✅ Form validation prevents submitting invalid data
3. ✅ Backend always returns valid string values, never NaN
4. ✅ Frontend validates all inputs before calling contract functions

## Next Steps

1. **Refresh your browser** (Ctrl+Shift+R) to load the updated frontend code
2. **Backend has been restarted** with the fixes
3. **Try creating a vesting schedule** - you should see clear validation errors if inputs are invalid
4. **Try releasing tokens** - invalid amounts will be caught before calling the contract

The NaN underflow error should now be resolved!









