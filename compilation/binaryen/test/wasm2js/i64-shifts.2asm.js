
function asmFunc(env) {
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_sqrt = Math.sqrt;
 var abort = env.abort;
 var nan = NaN;
 var infinity = Infinity;
 function $1($0, $0$hi, $1_1, $1$hi, $2_1, $2$hi) {
  $0 = $0 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $12 = 0, $5$hi = 0;
  i64toi32_i32$0 = $0$hi;
  i64toi32_i32$0 = $1$hi;
  i64toi32_i32$0 = $0$hi;
  i64toi32_i32$2 = $0;
  i64toi32_i32$1 = $1$hi;
  i64toi32_i32$3 = $1_1;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $12 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $12 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  $5$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $2$hi;
  i64toi32_i32$1 = $5$hi;
  i64toi32_i32$0 = $12;
  i64toi32_i32$2 = $2$hi;
  i64toi32_i32$3 = $2_1;
  return (i64toi32_i32$0 | 0) == (i64toi32_i32$3 | 0) & (i64toi32_i32$1 | 0) == (i64toi32_i32$2 | 0) | 0 | 0;
 }
 
 function $2($0, $0$hi, $1_1, $1$hi, $2_1, $2$hi) {
  $0 = $0 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, i64toi32_i32$2 = 0, $12 = 0, $5$hi = 0;
  i64toi32_i32$0 = $0$hi;
  i64toi32_i32$0 = $1$hi;
  i64toi32_i32$0 = $0$hi;
  i64toi32_i32$2 = $0;
  i64toi32_i32$1 = $1$hi;
  i64toi32_i32$3 = $1_1;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$0 >> 31 | 0;
   $12 = i64toi32_i32$0 >> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$1 = i64toi32_i32$0 >> i64toi32_i32$4 | 0;
   $12 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
  }
  $5$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $2$hi;
  i64toi32_i32$1 = $5$hi;
  i64toi32_i32$0 = $12;
  i64toi32_i32$2 = $2$hi;
  i64toi32_i32$3 = $2_1;
  return (i64toi32_i32$0 | 0) == (i64toi32_i32$3 | 0) & (i64toi32_i32$1 | 0) == ($2$hi | 0) | 0 | 0;
 }
 
 function legalstub$1($0, $1_1, $2_1, $3, $4, $5) {
  $0 = $0 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  $5 = $5 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $26 = 0, $27 = 0, $28 = 0, $7 = 0, $7$hi = 0, $10$hi = 0, $11 = 0, $11$hi = 0, $13 = 0, $13$hi = 0, $16$hi = 0, $17 = 0, $17$hi = 0, $19 = 0, $19$hi = 0, $22$hi = 0, $23 = 0, $23$hi = 0;
  i64toi32_i32$0 = 0;
  $7 = $0;
  $7$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$2 = $1_1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $26 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $26 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  $10$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $7$hi;
  i64toi32_i32$0 = $7;
  i64toi32_i32$2 = $10$hi;
  i64toi32_i32$3 = $26;
  i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
  $11 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
  $11$hi = i64toi32_i32$2;
  i64toi32_i32$2 = 0;
  $13 = $2_1;
  $13$hi = i64toi32_i32$2;
  i64toi32_i32$2 = 0;
  i64toi32_i32$1 = $3;
  i64toi32_i32$0 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
   $27 = 0;
  } else {
   i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
   $27 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
  }
  $16$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $13$hi;
  i64toi32_i32$2 = $13;
  i64toi32_i32$1 = $16$hi;
  i64toi32_i32$3 = $27;
  i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
  $17 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
  $17$hi = i64toi32_i32$1;
  i64toi32_i32$1 = 0;
  $19 = $4;
  $19$hi = i64toi32_i32$1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$0 = $5;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
   $28 = 0;
  } else {
   i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
   $28 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
  }
  $22$hi = i64toi32_i32$2;
  i64toi32_i32$2 = $19$hi;
  i64toi32_i32$1 = $19;
  i64toi32_i32$0 = $22$hi;
  i64toi32_i32$3 = $28;
  i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
  $23 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
  $23$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $11$hi;
  i64toi32_i32$1 = $17$hi;
  i64toi32_i32$2 = $23$hi;
  return $1($11 | 0, i64toi32_i32$0 | 0, $17 | 0, i64toi32_i32$1 | 0, $23 | 0, i64toi32_i32$2 | 0) | 0 | 0;
 }
 
 function legalstub$2($0, $1_1, $2_1, $3, $4, $5) {
  $0 = $0 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  $5 = $5 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $26 = 0, $27 = 0, $28 = 0, $7 = 0, $7$hi = 0, $10$hi = 0, $11 = 0, $11$hi = 0, $13 = 0, $13$hi = 0, $16$hi = 0, $17 = 0, $17$hi = 0, $19 = 0, $19$hi = 0, $22$hi = 0, $23 = 0, $23$hi = 0;
  i64toi32_i32$0 = 0;
  $7 = $0;
  $7$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$2 = $1_1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $26 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $26 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  $10$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $7$hi;
  i64toi32_i32$0 = $7;
  i64toi32_i32$2 = $10$hi;
  i64toi32_i32$3 = $26;
  i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
  $11 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
  $11$hi = i64toi32_i32$2;
  i64toi32_i32$2 = 0;
  $13 = $2_1;
  $13$hi = i64toi32_i32$2;
  i64toi32_i32$2 = 0;
  i64toi32_i32$1 = $3;
  i64toi32_i32$0 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
   $27 = 0;
  } else {
   i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
   $27 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
  }
  $16$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $13$hi;
  i64toi32_i32$2 = $13;
  i64toi32_i32$1 = $16$hi;
  i64toi32_i32$3 = $27;
  i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
  $17 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
  $17$hi = i64toi32_i32$1;
  i64toi32_i32$1 = 0;
  $19 = $4;
  $19$hi = i64toi32_i32$1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$0 = $5;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
   $28 = 0;
  } else {
   i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
   $28 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
  }
  $22$hi = i64toi32_i32$2;
  i64toi32_i32$2 = $19$hi;
  i64toi32_i32$1 = $19;
  i64toi32_i32$0 = $22$hi;
  i64toi32_i32$3 = $28;
  i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
  $23 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
  $23$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $11$hi;
  i64toi32_i32$1 = $17$hi;
  i64toi32_i32$2 = $23$hi;
  return $2($11 | 0, i64toi32_i32$0 | 0, $17 | 0, i64toi32_i32$1 | 0, $23 | 0, i64toi32_i32$2 | 0) | 0 | 0;
 }
 
 return {
  "shl_i64": legalstub$1, 
  "shr_i64": legalstub$2
 };
}

var retasmFunc = asmFunc(  { abort: function() { throw new Error('abort'); }
  });
export var shl_i64 = retasmFunc.shl_i64;
export var shr_i64 = retasmFunc.shr_i64;