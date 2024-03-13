/**
 * Loader for KTX 2.0 GPU Texture containers.
 *
 * KTX 2.0 is a container format for various GPU texture formats. The loader
 * supports Basis Universal GPU textures, which can be quickly transcoded to
 * a wide variety of GPU texture compression formats, as well as some
 * uncompressed DataTexture and Data3DTexture formats.
 *
 * References:
 * - KTX: http://github.khronos.org/KTX-Specification/
 * - DFD: https://www.khronos.org/registry/DataFormat/specs/1.3/dataformat.1.3.html#basicdescriptor
 */

import {
	CompressedTexture,
	CompressedArrayTexture,
	CompressedCubeTexture,
	Data3DTexture,
	DataTexture,
	DisplayP3ColorSpace,
	FileLoader,
	FloatType,
	HalfFloatType,
	NoColorSpace,
	LinearFilter,
	LinearMipmapLinearFilter,
	LinearDisplayP3ColorSpace,
	LinearSRGBColorSpace,
	Loader,
	RedFormat,
	RGB_ETC1_Format,
	RGB_ETC2_Format,
	RGB_PVRTC_4BPPV1_Format,
	RGB_S3TC_DXT1_Format,
	RGBA_ASTC_4x4_Format,
	RGBA_ASTC_6x6_Format,
	RGBA_BPTC_Format,
	RGBA_ETC2_EAC_Format,
	RGBA_PVRTC_4BPPV1_Format,
	RGBA_S3TC_DXT5_Format,
	RGBAFormat,
	RGFormat,
	SRGBColorSpace,
	UnsignedByteType,
} from 'three';
import { WorkerPool } from '../utils/WorkerPool.js';
import {
	read,
	KHR_DF_FLAG_ALPHA_PREMULTIPLIED,
	KHR_DF_TRANSFER_SRGB,
	KHR_SUPERCOMPRESSION_NONE,
	KHR_SUPERCOMPRESSION_ZSTD,
	VK_FORMAT_UNDEFINED,
	VK_FORMAT_R16_SFLOAT,
	VK_FORMAT_R16G16_SFLOAT,
	VK_FORMAT_R16G16B16A16_SFLOAT,
	VK_FORMAT_R32_SFLOAT,
	VK_FORMAT_R32G32_SFLOAT,
	VK_FORMAT_R32G32B32A32_SFLOAT,
	VK_FORMAT_R8_SRGB,
	VK_FORMAT_R8_UNORM,
	VK_FORMAT_R8G8_SRGB,
	VK_FORMAT_R8G8_UNORM,
	VK_FORMAT_R8G8B8A8_SRGB,
	VK_FORMAT_R8G8B8A8_UNORM,
	VK_FORMAT_ASTC_6x6_SRGB_BLOCK,
	VK_FORMAT_ASTC_6x6_UNORM_BLOCK,
	KHR_DF_PRIMARIES_UNSPECIFIED,
	KHR_DF_PRIMARIES_BT709,
	KHR_DF_PRIMARIES_DISPLAYP3
} from '../libs/ktx-parse.module.js';
import { ZSTDDecoder } from '../libs/zstddec.module.js';
import { basisBin } from '../libs/basis.module.js';
const basisTranscoder = String.raw`var BASIS=function(){var t="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0;return"undefined"!=typeof __filename&&(t=t||__filename),function(e){var r,n,o,i,a,u,s,c,f,l,p,d,h,v,y,m,g,$,w,_,T,b,C,P,A,W=void 0!==(e=e||{})?e:{};W.ready=new Promise(function(t,e){n=t,o=e});var k={};for(i in W)W.hasOwnProperty(i)&&(k[i]=W[i]);var S=[],E="./this.program",R=function(t,e){throw e},F=!1,O=!1,j=!1,x=!1;F="object"==typeof window,O="function"==typeof importScripts,j="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,x=!F&&!j&&!O;var D="";j?(D=O?require("path").dirname(D)+"/":__dirname+"/",a=function t(e,r){return f||(f=require("fs")),l||(l=require("path")),e=l.normalize(e),f.readFileSync(e,r?null:"utf8")},s=function t(e){var r=a(e,!0);return r.buffer||(r=new Uint8Array(r)),M(r.buffer),r},process.argv.length>1&&(E=process.argv[1].replace(/\\/g,"/")),S=process.argv.slice(2),process.on("uncaughtException",function(t){if(!(t instanceof eT))throw t}),process.on("unhandledRejection",tl),R=function(t){process.exit(t)},W.inspect=function(){return"[Emscripten Module object]"}):x?("undefined"!=typeof read&&(a=function t(e){return read(e)}),s=function t(e){var r;return"function"==typeof readbuffer?new Uint8Array(readbuffer(e)):(r=read(e,"binary"),M("object"==typeof r),r)},"undefined"!=typeof scriptArgs?S=scriptArgs:"undefined"!=typeof arguments&&(S=arguments),"function"==typeof quit&&(R=function(t){quit(t)}),"undefined"!=typeof print&&("undefined"==typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!=typeof printErr?printErr:print)):(F||O)&&(O?D=self.location.href:"undefined"!=typeof document&&document.currentScript&&(D=document.currentScript.src),t&&(D=t),D=0!==D.indexOf("blob:")?D.substr(0,D.lastIndexOf("/")+1):"",a=function t(e){var r=new XMLHttpRequest;return r.open("GET",e,!1),r.send(null),r.responseText},O&&(s=function t(e){var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffer",r.send(null),new Uint8Array(r.response)}),u=function t(e,r,n){var o=new XMLHttpRequest;o.open("GET",e,!0),o.responseType="arraybuffer",o.onload=function t(){if(200==o.status||0==o.status&&o.response){r(o.response);return}n()},o.onerror=n,o.send(null)},c=function(t){document.title=t});var I=W.print||console.log.bind(console),B=W.printErr||console.warn.bind(console);for(i in k)k.hasOwnProperty(i)&&(W[i]=k[i]);k=null,W.arguments&&(S=W.arguments),W.thisProgram&&(E=W.thisProgram),W.quit&&(R=W.quit);var V=0,U=function(t){V=t};W.wasmBinary&&(p=W.wasmBinary),W.noExitRuntime&&(d=W.noExitRuntime),"object"!=typeof WebAssembly&&tl("no native wasm support detected");var H=!1;function M(t,e){t||tl("Assertion failed: "+e)}var N="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function z(t,e,r){for(var n=e+r,o=e;t[o]&&!(o>=n);)++o;if(o-e>16&&t.subarray&&N)return N.decode(t.subarray(e,o));for(var i="";e<o;){var a=t[e++];if(!(128&a)){i+=String.fromCharCode(a);continue}var u=63&t[e++];if((224&a)==192){i+=String.fromCharCode((31&a)<<6|u);continue}var s=63&t[e++];if((a=(240&a)==224?(15&a)<<12|u<<6|s:(7&a)<<18|u<<12|s<<6|63&t[e++])<65536)i+=String.fromCharCode(a);else{var c=a-65536;i+=String.fromCharCode(55296|c>>10,56320|1023&c)}}return i}function q(t,e){return t?z(g,t,e):""}var G="undefined"!=typeof TextDecoder?new TextDecoder("utf-16le"):void 0;function L(t,e){for(var r=t,n=r>>1,o=n+e/2;!(n>=o)&&w[n];)++n;if((r=n<<1)-t>32&&G)return G.decode(g.subarray(t,r));for(var i="",a=0;!(a>=e/2);++a){var u=$[t+2*a>>1];if(0==u)break;i+=String.fromCharCode(u)}return i}function J(t,e,r){if(void 0===r&&(r=2147483647),r<2)return 0;for(var n=e,o=(r-=2)<2*t.length?r/2:t.length,i=0;i<o;++i){var a=t.charCodeAt(i);$[e>>1]=a,e+=2}return $[e>>1]=0,e-n}function K(t){return 2*t.length}function Q(t,e){for(var r=0,n="";!(r>=e/4);){var o=_[t+4*r>>2];if(0==o)break;if(++r,o>=65536){var i=o-65536;n+=String.fromCharCode(55296|i>>10,56320|1023&i)}else n+=String.fromCharCode(o)}return n}function Y(t,e,r){if(void 0===r&&(r=2147483647),r<4)return 0;for(var n=e,o=n+r-4,i=0;i<t.length;++i){var a=t.charCodeAt(i);if(a>=55296&&a<=57343&&(a=65536+((1023&a)<<10)|1023&t.charCodeAt(++i)),_[e>>2]=a,(e+=4)+4>o)break}return _[e>>2]=0,e-n}function Z(t){for(var e=0,r=0;r<t.length;++r){var n=t.charCodeAt(r);n>=55296&&n<=57343&&++r,e+=4}return e}function X(t,e){return t%e>0&&(t+=e-t%e),t}function tt(t){y=t,W.HEAP8=m=new Int8Array(t),W.HEAP16=$=new Int16Array(t),W.HEAP32=_=new Int32Array(t),W.HEAPU8=g=new Uint8Array(t),W.HEAPU16=w=new Uint16Array(t),W.HEAPU32=T=new Uint32Array(t),W.HEAPF32=b=new Float32Array(t),W.HEAPF64=C=new Float64Array(t)}W.INITIAL_MEMORY;var te=[],tr=[],tn=[],to=[],ti=!1;function ta(t){te.unshift(t)}function tu(t){to.unshift(t)}var ts=0,tc=null,tf=null;function tl(t){W.onAbort&&W.onAbort(t),B(t+=""),H=!0,v=1,t="abort("+t+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(t);throw o(e),e}function tp(t,e){return String.prototype.startsWith?t.startsWith(e):0===t.indexOf(e)}function td(t){return tp(t,"data:application/octet-stream;base64,")}function th(t){return tp(t,"file://")}W.preloadedImages={},W.preloadedAudios={};var tv="basis_transcoder.wasm";function ty(){try{if(p)return new Uint8Array(p);if(s)return s(tv);throw"both async and sync fetching of the wasm failed"}catch(t){tl(t)}}function tm(t){for(;t.length>0;){var e=t.shift();if("function"==typeof e){e(W);continue}var r=e.func;"number"==typeof r?void 0===e.arg?P.get(r)():P.get(r)(e.arg):r(void 0===e.arg?null:e.arg)}}!td(tv)&&(tv=(r=tv,W.locateFile?W.locateFile(r,D):D+r));var tg={};function t$(t){for(;t.length;){var e=t.pop();t.pop()(e)}}function tw(t){return this.fromWireType(T[t>>2])}var t_={},tT={},tb={};function t9(t){if(void 0===t)return"_unknown";var e=(t=t.replace(/[^a-zA-Z0-9_]/g,"$")).charCodeAt(0);return e>=48&&e<=57?"_"+t:t}function tC(t,e){return t=t9(t),Function("body","return function "+t+'() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(e)}function t0(t,e){var r=tC(e,function(t){this.name=e,this.message=t;var r=Error(t).stack;void 0!==r&&(this.stack=this.toString()+"\n"+r.replace(/^Error(:[^\n]*)?\n/,""))});return r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.prototype.toString=function(){return void 0===this.message?this.name:this.name+": "+this.message},r}var tP=void 0;function t8(t){throw new tP(t)}function t4(t,e,r){function n(e){var n=r(e);n.length!==t.length&&t8("Mismatched type converter count");for(var o=0;o<t.length;++o)tk(t[o],n[o])}t.forEach(function(t){tb[t]=e});var o=Array(e.length),i=[],a=0;e.forEach(function(t,e){tT.hasOwnProperty(t)?o[e]=tT[t]:(i.push(t),t_.hasOwnProperty(t)||(t_[t]=[]),t_[t].push(function(){o[e]=tT[t],++a===i.length&&n(o)}))}),0===i.length&&n(o)}function t2(t){switch(t){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw TypeError("Unknown type size: "+t)}}var t1=void 0;function tA(t){for(var e="",r=t;g[r];)e+=t1[g[r++]];return e}var tW=void 0;function t3(t){throw new tW(t)}function tk(t,e,r){if(r=r||{},!("argPackAdvance"in e))throw TypeError("registerType registeredInstance requires argPackAdvance");var n=e.name;if(t||t3('type "'+n+'" must have a positive integer typeid pointer'),tT.hasOwnProperty(t)){if(r.ignoreDuplicateRegistrations)return;t3("Cannot register type '"+n+"' twice")}if(tT[t]=e,delete tb[t],t_.hasOwnProperty(t)){var o=t_[t];delete t_[t],o.forEach(function(t){t()})}}function tS(t){var e;t3((e=t).$$.ptrType.registeredClass.name+" instance already deleted")}var tE=!1;function tR(t){}function tF(t){var e;t.count.value-=1,0===t.count.value&&((e=t).smartPtr?e.smartPtrType.rawDestructor(e.smartPtr):e.ptrType.registeredClass.rawDestructor(e.ptr))}function tO(t){return"undefined"==typeof FinalizationGroup?(tO=function(t){return t},t):(tE=new FinalizationGroup(function(t){for(var e=t.next();!e.done;e=t.next()){var r=e.value;r.ptr?tF(r):console.warn("object already deleted: "+r.ptr)}}),tO=function(t){return tE.register(t,t.$$,t.$$),t},tR=function(t){tE.unregister(t.$$)},tO(t))}var t6=void 0,tj=[];function tx(){for(;tj.length;){var t=tj.pop();t.$$.deleteScheduled=!1,t.delete()}}function tD(){}var tI={};function t5(t,e,r){if(void 0===t[e].overloadTable){var n=t[e];t[e]=function(){return t[e].overloadTable.hasOwnProperty(arguments.length)||t3("Function '"+r+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+t[e].overloadTable+")!"),t[e].overloadTable[arguments.length].apply(this,arguments)},t[e].overloadTable=[],t[e].overloadTable[n.argCount]=n}}function tB(t,e,r){W.hasOwnProperty(t)?((void 0===r||void 0!==W[t].overloadTable&&void 0!==W[t].overloadTable[r])&&t3("Cannot register public name '"+t+"' twice"),t5(W,t,t),W.hasOwnProperty(r)&&t3("Cannot register multiple overloads of a function with the same number of arguments ("+r+")!"),W[t].overloadTable[r]=e):(W[t]=e,void 0!==r&&(W[t].numArguments=r))}function tV(t,e,r,n,o,i,a,u){this.name=t,this.constructor=e,this.instancePrototype=r,this.rawDestructor=n,this.baseClass=o,this.getActualType=i,this.upcast=a,this.downcast=u,this.pureVirtualFunctions=[]}function tU(t,e,r){for(;e!==r;)e.upcast||t3("Expected null or instance of "+r.name+", got an instance of "+e.name),t=e.upcast(t),e=e.baseClass;return t}function t7(t,e){if(null===e)return this.isReference&&t3("null is not a valid "+this.name),0;e.$$||t3('Cannot pass "'+ei(e)+'" as a '+this.name),e.$$.ptr||t3("Cannot pass deleted object as a pointer of type "+this.name);var r=e.$$.ptrType.registeredClass;return tU(e.$$.ptr,r,this.registeredClass)}function tH(t,e){if(null===e)return(this.isReference&&t3("null is not a valid "+this.name),this.isSmartPointer)?(r=this.rawConstructor(),null!==t&&t.push(this.rawDestructor,r),r):0;e.$$||t3('Cannot pass "'+ei(e)+'" as a '+this.name),e.$$.ptr||t3("Cannot pass deleted object as a pointer of type "+this.name),!this.isConst&&e.$$.ptrType.isConst&&t3("Cannot convert argument of type "+(e.$$.smartPtrType?e.$$.smartPtrType.name:e.$$.ptrType.name)+" to parameter type "+this.name);var r,n=e.$$.ptrType.registeredClass;if(r=tU(e.$$.ptr,n,this.registeredClass),this.isSmartPointer)switch(void 0===e.$$.smartPtr&&t3("Passing raw pointer to smart pointer is illegal"),this.sharingPolicy){case 0:e.$$.smartPtrType===this?r=e.$$.smartPtr:t3("Cannot convert argument of type "+(e.$$.smartPtrType?e.$$.smartPtrType.name:e.$$.ptrType.name)+" to parameter type "+this.name);break;case 1:r=e.$$.smartPtr;break;case 2:if(e.$$.smartPtrType===this)r=e.$$.smartPtr;else{var o=e.clone();r=this.rawShare(r,en(function(){o.delete()})),null!==t&&t.push(this.rawDestructor,r)}break;default:t3("Unsupporting sharing policy")}return r}function tM(t,e){if(null===e)return this.isReference&&t3("null is not a valid "+this.name),0;e.$$||t3('Cannot pass "'+ei(e)+'" as a '+this.name),e.$$.ptr||t3("Cannot pass deleted object as a pointer of type "+this.name),e.$$.ptrType.isConst&&t3("Cannot convert argument of type "+e.$$.ptrType.name+" to parameter type "+this.name);var r=e.$$.ptrType.registeredClass;return tU(e.$$.ptr,r,this.registeredClass)}var tN={};function tz(t,e){e.ptrType&&e.ptr||t8("makeClassHandle requires ptr and ptrType");var r=!!e.smartPtrType;return!!e.smartPtr!==r&&t8("Both smartPtrType and smartPtr must be specified"),e.count={value:1},tO(Object.create(t,{$$:{value:e}}))}function tq(t,e,r,n,o,i,a,u,s,c,f){this.name=t,this.registeredClass=e,this.isReference=r,this.isConst=n,this.isSmartPointer=o,this.pointeeType=i,this.sharingPolicy=a,this.rawGetPointee=u,this.rawConstructor=s,this.rawShare=c,this.rawDestructor=f,o||void 0!==e.baseClass?this.toWireType=tH:n?(this.toWireType=t7,this.destructorFunction=null):(this.toWireType=tM,this.destructorFunction=null)}function tG(t,e,r){W.hasOwnProperty(t)||t8("Replacing nonexistant public symbol"),void 0!==W[t].overloadTable&&void 0!==r?W[t].overloadTable[r]=e:(W[t]=e,W[t].argCount=r)}function tL(t,e){t=tA(t);var r=function r(){if(-1!=t.indexOf("j")){var n,o,i;return n=t,o=e,M(n.indexOf("j")>=0,"getDynCaller should only be called with i64 sigs"),i=[],function(){i.length=arguments.length;for(var t=0;t<arguments.length;t++)i[t]=arguments[t];return function t(e,r,n){if(-1!=e.indexOf("j")){var o,i,a;return o=e,i=r,(a=n)&&a.length?W["dynCall_"+o].apply(null,[i].concat(a)):W["dynCall_"+o].call(null,i)}return P.get(r).apply(null,n)}(n,o,i)}}return P.get(e)}();return"function"!=typeof r&&t3("unknown function pointer with signature "+t+": "+e),r}var tJ=void 0;function tK(t){var e=e$(t),r=tA(e);return eg(e),r}function tQ(t,e){var r=[],n={};function o(t){if(!n[t]&&!tT[t]){if(tb[t]){tb[t].forEach(o);return}r.push(t),n[t]=!0}}throw e.forEach(o),new tJ(t+": "+r.map(tK).join([", "]))}function tY(t,e){for(var r=[],n=0;n<t;n++)r.push(_[(e>>2)+n]);return r}function tZ(t,e){if(!(t instanceof Function))throw TypeError("new_ called with constructor type "+typeof t+" which is not a function");var r=tC(t.name||"unknownFunctionName",function(){});r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return o instanceof Object?o:n}function tX(t,e,r,n,o){var i=e.length;i<2&&t3("argTypes array size mismatch! Must at least get return value and 'this' types!");for(var a=null!==e[1]&&null!==r,u=!1,s=1;s<e.length;++s)if(null!==e[s]&&void 0===e[s].destructorFunction){u=!0;break}for(var c="void"!==e[0].name,f="",l="",s=0;s<i-2;++s)f+=(0!==s?", ":"")+"arg"+s,l+=(0!==s?", ":"")+"arg"+s+"Wired";var p="return function "+t9(t)+"("+f+") {\nif (arguments.length !== "+(i-2)+") {\nthrowBindingError('function "+t+" called with ' + arguments.length + ' arguments, expected "+(i-2)+" args!');\n}\n";u&&(p+="var destructors = [];\n");var d=u?"destructors":"null",h=["throwBindingError","invoker","fn","runDestructors","retType","classParam"],v=[t3,n,o,t$,e[0],e[1]];a&&(p+="var thisWired = classParam.toWireType("+d+", this);\n");for(var s=0;s<i-2;++s)p+="var arg"+s+"Wired = argType"+s+".toWireType("+d+", arg"+s+"); // "+e[s+2].name+"\n",h.push("argType"+s),v.push(e[s+2]);if(a&&(l="thisWired"+(l.length>0?", ":"")+l),p+=(c?"var rv = ":"")+"invoker(fn"+(l.length>0?", ":"")+l+");\n",u)p+="runDestructors(destructors);\n";else for(var s=a?1:2;s<e.length;++s){var y=1===s?"thisWired":"arg"+(s-2)+"Wired";null!==e[s].destructorFunction&&(p+=y+"_dtor("+y+"); // "+e[s].name+"\n",h.push(y+"_dtor"),v.push(e[s].destructorFunction))}return c&&(p+="var ret = retType.fromWireType(rv);\nreturn ret;\n"),p+="}\n",h.push(p),tZ(Function,h).apply(null,v)}var et=[],ee=[{},{value:void 0},{value:null},{value:!0},{value:!1}];function er(t){t>4&&0==--ee[t].refcount&&(ee[t]=void 0,et.push(t))}function en(t){switch(t){case void 0:return 1;case null:return 2;case!0:return 3;case!1:return 4;default:var e=et.length?et.pop():ee.length;return ee[e]={refcount:1,value:t},e}}function eo(t,e){var r=tT[t];return void 0===r&&t3(e+" has unknown type "+tK(t)),r}function ei(t){if(null===t)return"null";var e=typeof t;return"object"===e||"array"===e||"function"===e?t.toString():""+t}function ea(t){return t||t3("Cannot use deleted val. handle = "+t),ee[t].value}var eu={};function es(t){var e=eu[t];return void 0===e?tA(t):e}var ec=[];function ef(){return"object"==typeof globalThis?globalThis:Function("return this")()}var el={};function ep(t){try{return h.grow(t-y.byteLength+65535>>>16),tt(h.buffer),1}catch(e){}}var ed={mappings:{},buffers:[null,[],[]],printChar:function(t,e){var r=ed.buffers[t];0===e||10===e?((1===t?I:B)(z(r,0)),r.length=0):r.push(e)},varargs:void 0,get:function(){return ed.varargs+=4,_[ed.varargs-4>>2]},getStr:function(t){return q(t)},get64:function(t,e){return t}};function eh(t){return 0}tP=W.InternalError=t0(Error,"InternalError"),function t(){for(var e=Array(256),r=0;r<256;++r)e[r]=String.fromCharCode(r);t1=e}(),tW=W.BindingError=t0(Error,"BindingError"),tD.prototype.isAliasOf=function t(e){if(!(this instanceof tD)||!(e instanceof tD))return!1;for(var r=this.$$.ptrType.registeredClass,n=this.$$.ptr,o=e.$$.ptrType.registeredClass,i=e.$$.ptr;r.baseClass;)n=r.upcast(n),r=r.baseClass;for(;o.baseClass;)i=o.upcast(i),o=o.baseClass;return r===o&&n===i},tD.prototype.clone=function t(){if(this.$$.ptr||tS(this),this.$$.preservePointerOnDelete)return this.$$.count.value+=1,this;var e,r=tO(Object.create(Object.getPrototypeOf(this),{$$:{value:{count:(e=this.$$).count,deleteScheduled:e.deleteScheduled,preservePointerOnDelete:e.preservePointerOnDelete,ptr:e.ptr,ptrType:e.ptrType,smartPtr:e.smartPtr,smartPtrType:e.smartPtrType}}}));return r.$$.count.value+=1,r.$$.deleteScheduled=!1,r},tD.prototype.delete=function t(){this.$$.ptr||tS(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&t3("Object already scheduled for deletion"),tR(this),tF(this.$$),this.$$.preservePointerOnDelete||(this.$$.smartPtr=void 0,this.$$.ptr=void 0)},tD.prototype.isDeleted=function t(){return!this.$$.ptr},tD.prototype.deleteLater=function t(){return this.$$.ptr||tS(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&t3("Object already scheduled for deletion"),tj.push(this),1===tj.length&&t6&&t6(tx),this.$$.deleteScheduled=!0,this},tq.prototype.getPointee=function t(e){return this.rawGetPointee&&(e=this.rawGetPointee(e)),e},tq.prototype.destructor=function t(e){this.rawDestructor&&this.rawDestructor(e)},tq.prototype.argPackAdvance=8,tq.prototype.readValueFromPointer=tw,tq.prototype.deleteObject=function t(e){null!==e&&e.delete()},tq.prototype.fromWireType=function t(e){var r,n=this.getPointee(e);if(!n)return this.destructor(e),null;var o,i,a=(o=this.registeredClass,i=n,tN[i=function t(e,r){for(void 0===r&&t3("ptr should not be undefined");e.baseClass;)r=e.upcast(r),e=e.baseClass;return r}(o,i)]);if(void 0!==a){if(0===a.$$.count.value)return a.$$.ptr=n,a.$$.smartPtr=e,a.clone();var u=a.clone();return this.destructor(e),u}function s(){return this.isSmartPointer?tz(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:n,smartPtrType:this,smartPtr:e}):tz(this.registeredClass.instancePrototype,{ptrType:this,ptr:e})}var c=tI[this.registeredClass.getActualType(n)];if(!c)return s.call(this);r=this.isConst?c.constPointerType:c.pointerType;var f=function t(e,r,n){if(r===n)return e;if(void 0===n.baseClass)return null;var o=t(e,r,n.baseClass);return null===o?null:n.downcast(o)}(n,this.registeredClass,r.registeredClass);return null===f?s.call(this):this.isSmartPointer?tz(r.registeredClass.instancePrototype,{ptrType:r,ptr:f,smartPtrType:this,smartPtr:e}):tz(r.registeredClass.instancePrototype,{ptrType:r,ptr:f})},W.getInheritedInstanceCount=function t(){return Object.keys(tN).length},W.getLiveInheritedInstances=function t(){var e=[];for(var r in tN)tN.hasOwnProperty(r)&&e.push(tN[r]);return e},W.flushPendingDeletes=tx,W.setDelayFunction=function t(e){t6=e,tj.length&&t6&&t6(tx)},tJ=W.UnboundTypeError=t0(Error,"UnboundTypeError"),W.count_emval_handles=function t(){for(var e=0,r=5;r<ee.length;++r)void 0!==ee[r]&&++e;return e},W.get_first_emval=function t(){for(var e=5;e<ee.length;++e)if(void 0!==ee[e])return ee[e];return null},tr.push({func:function(){ey()}});var ev={t:function t(e){var r=tg[e];delete tg[e];var n=r.rawConstructor,o=r.rawDestructor,i=r.fields;t4([e],i.map(function(t){return t.getterReturnType}).concat(i.map(function(t){return t.setterArgumentType})),function(t){var e={};return i.forEach(function(r,n){var o=r.fieldName,a=t[n],u=r.getter,s=r.getterContext,c=t[n+i.length],f=r.setter,l=r.setterContext;e[o]={read:function(t){return a.fromWireType(u(s,t))},write:function(t,e){var r=[];f(l,t,c.toWireType(r,e)),t$(r)}}}),[{name:r.name,fromWireType:function(t){var r={};for(var n in e)r[n]=e[n].read(t);return o(t),r},toWireType:function(t,r){for(var i in e)if(!(i in r))throw TypeError('Missing field:  "'+i+'"');var a=n();for(i in e)e[i].write(a,r[i]);return null!==t&&t.push(o,a),a},argPackAdvance:8,readValueFromPointer:tw,destructorFunction:o}]})},I:function t(e,r,n,o,i){var a=t2(n);r=tA(r),tk(e,{name:r,fromWireType:function(t){return!!t},toWireType:function(t,e){return e?o:i},argPackAdvance:8,readValueFromPointer:function(t){var e;if(1===n)e=m;else if(2===n)e=$;else if(4===n)e=_;else throw TypeError("Unknown boolean type size: "+r);return this.fromWireType(e[t>>a])},destructorFunction:null})},x:function t(e,r,n,o,i,a,u,s,c,f,l,p,d){l=tA(l),a=tL(i,a),s&&(s=tL(u,s)),f&&(f=tL(c,f)),d=tL(p,d);var h=t9(l);tB(h,function(){tQ("Cannot construct "+l+" due to unbound types",[o])}),t4([e,r,n],o?[o]:[],function(t){t=t[0],n=o?(r=t.registeredClass).instancePrototype:tD.prototype;var r,n,i=tC(h,function(){if(Object.getPrototypeOf(this)!==u)throw new tW("Use 'new' to construct "+l);if(void 0===c.constructor_body)throw new tW(l+" has no accessible constructor");var t=c.constructor_body[arguments.length];if(void 0===t)throw new tW("Tried to invoke ctor of "+l+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(c.constructor_body).toString()+") parameters instead!");return t.apply(this,arguments)}),u=Object.create(n,{constructor:{value:i}});i.prototype=u;var c=new tV(l,i,u,d,r,a,s,f),p=new tq(l,c,!0,!1,!1),v=new tq(l+"*",c,!1,!1,!1),y=new tq(l+" const*",c,!1,!0,!1);return tI[e]={pointerType:v,constPointerType:y},tG(h,i),[p,v,y]})},w:function t(e,r,n,o,i,a){M(r>0);var u=tY(r,n);i=tL(o,i);var s=[a],c=[];t4([],[e],function(t){var e="constructor "+(t=t[0]).name;if(void 0===t.registeredClass.constructor_body&&(t.registeredClass.constructor_body=[]),void 0!==t.registeredClass.constructor_body[r-1])throw new tW("Cannot register multiple constructors with identical number of parameters ("+(r-1)+") for class '"+t.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!");return t.registeredClass.constructor_body[r-1]=function e(){tQ("Cannot construct "+t.name+" due to unbound types",u)},t4([],u,function(n){return t.registeredClass.constructor_body[r-1]=function t(){arguments.length!==r-1&&t3(e+" called with "+arguments.length+" arguments, expected "+(r-1)),c.length=0,s.length=r;for(var o=1;o<r;++o)s[o]=n[o].toWireType(c,arguments[o-1]);var a=i.apply(null,s);return t$(c),n[0].fromWireType(a)},[]}),[]})},d:function t(e,r,n,o,i,a,u,s){var c=tY(n,o);r=tA(r),a=tL(i,a),t4([],[e],function(t){var e=(t=t[0]).name+"."+r;function o(){tQ("Cannot call "+e+" due to unbound types",c)}s&&t.registeredClass.pureVirtualFunctions.push(r);var i=t.registeredClass.instancePrototype,f=i[r];return void 0===f||void 0===f.overloadTable&&f.className!==t.name&&f.argCount===n-2?(o.argCount=n-2,o.className=t.name,i[r]=o):(t5(i,r,e),i[r].overloadTable[n-2]=o),t4([],c,function(o){var s=tX(e,o,t,a,u);return void 0===i[r].overloadTable?(s.argCount=n-2,i[r]=s):i[r].overloadTable[n-2]=s,[]}),[]})},k:function t(e,r,n){e=tA(e),t4([],[r],function(t){return t=t[0],W[e]=t.fromWireType(n),[]})},H:function t(e,r){r=tA(r),tk(e,{name:r,fromWireType:function(t){var e=ee[t].value;return er(t),e},toWireType:function(t,e){return en(e)},argPackAdvance:8,readValueFromPointer:tw,destructorFunction:null})},n:function t(e,r,n,o){var i=t2(n);function a(){}r=tA(r),a.values={},tk(e,{name:r,constructor:a,fromWireType:function(t){return this.constructor.values[t]},toWireType:function(t,e){return e.value},argPackAdvance:8,readValueFromPointer:function t(e,r,n){switch(r){case 0:return function(t){var e=n?m:g;return this.fromWireType(e[t])};case 1:return function(t){var e=n?$:w;return this.fromWireType(e[t>>1])};case 2:return function(t){var e=n?_:T;return this.fromWireType(e[t>>2])};default:throw TypeError("Unknown integer type: "+e)}}(r,i,o),destructorFunction:null}),tB(r,a)},a:function t(e,r,n){var o=eo(e,"enum");r=tA(r);var i=o.constructor,a=Object.create(o.constructor.prototype,{value:{value:n},constructor:{value:tC(o.name+"_"+r,function(){})}});i.values[n]=a,i[r]=a},A:function t(e,r,n){var o=t2(n);r=tA(r),tk(e,{name:r,fromWireType:function(t){return t},toWireType:function(t,e){if("number"!=typeof e&&"boolean"!=typeof e)throw TypeError('Cannot convert "'+ei(e)+'" to '+this.name);return e},argPackAdvance:8,readValueFromPointer:function t(e,r){switch(r){case 2:return function(t){return this.fromWireType(b[t>>2])};case 3:return function(t){return this.fromWireType(C[t>>3])};default:throw TypeError("Unknown float type: "+e)}}(r,o),destructorFunction:null})},i:function t(e,r,n,o,i,a){var u=tY(r,n);e=tA(e),i=tL(o,i),tB(e,function(){tQ("Cannot call "+e+" due to unbound types",u)},r-1),t4([],u,function(t){return tG(e,tX(e,[t[0],null].concat(t.slice(1)),null,i,a),r-1),[]})},j:function t(e,r,n,o,i){r=tA(r),-1===i&&(i=4294967295);var a=t2(n),u=function(t){return t};if(0===o){var s=32-8*n;u=function(t){return t<<s>>>s}}var c=-1!=r.indexOf("unsigned");tk(e,{name:r,fromWireType:u,toWireType:function(t,e){if("number"!=typeof e&&"boolean"!=typeof e)throw TypeError('Cannot convert "'+ei(e)+'" to '+this.name);if(e<o||e>i)throw TypeError('Passing a number "'+ei(e)+'" from JS side to C/C++ side to an argument of type "'+r+'", which is outside the valid range ['+o+", "+i+"]!");return c?e>>>0:0|e},argPackAdvance:8,readValueFromPointer:function t(e,r,n){switch(r){case 0:return n?function t(e){return m[e]}:function t(e){return g[e]};case 1:return n?function t(e){return $[e>>1]}:function t(e){return w[e>>1]};case 2:return n?function t(e){return _[e>>2]}:function t(e){return T[e>>2]};default:throw TypeError("Unknown integer type: "+e)}}(r,a,0!==o),destructorFunction:null})},h:function t(e,r,n){var o=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array][r];function i(t){var e=T,r=e[t>>=2],n=e[t+1];return new o(y,n,r)}n=tA(n),tk(e,{name:n,fromWireType:i,argPackAdvance:8,readValueFromPointer:i},{ignoreDuplicateRegistrations:!0})},B:function t(e,r){var n="std::string"===(r=tA(r));tk(e,{name:r,fromWireType:function(t){var e,r=T[t>>2];if(n)for(var o=t+4,i=0;i<=r;++i){var a=t+4+i;if(i==r||0==g[a]){var u=a-o,s=q(o,u);void 0===e?e=s:(e+="\0",e+=s),o=a+1}}else{for(var c=Array(r),i=0;i<r;++i)c[i]=String.fromCharCode(g[t+4+i]);e=c.join("")}return eg(t),e},toWireType:function(t,e){e instanceof ArrayBuffer&&(e=new Uint8Array(e));var r,o,i,a,u="string"==typeof e;u||e instanceof Uint8Array||e instanceof Uint8ClampedArray||e instanceof Int8Array||t3("Cannot pass non-string to std::string");var s=(a=n&&u?function(){return function t(e){for(var r=0,n=0;n<e.length;++n){var o=e.charCodeAt(n);o>=55296&&o<=57343&&(o=65536+((1023&o)<<10)|1023&e.charCodeAt(++n)),o<=127?++r:o<=2047?r+=2:o<=65535?r+=3:r+=4}return r}(e)}:function(){return e.length})(),c=em(4+s+1);if(T[c>>2]=s,n&&u)r=e,o=c+4,function t(e,r,n,o){if(!(o>0))return 0;for(var i=n,a=n+o-1,u=0;u<e.length;++u){var s=e.charCodeAt(u);if(s>=55296&&s<=57343&&(s=65536+((1023&s)<<10)|1023&e.charCodeAt(++u)),s<=127){if(n>=a)break;r[n++]=s}else if(s<=2047){if(n+1>=a)break;r[n++]=192|s>>6,r[n++]=128|63&s}else if(s<=65535){if(n+2>=a)break;r[n++]=224|s>>12,r[n++]=128|s>>6&63,r[n++]=128|63&s}else{if(n+3>=a)break;r[n++]=240|s>>18,r[n++]=128|s>>12&63,r[n++]=128|s>>6&63,r[n++]=128|63&s}}return r[n]=0,n-i}(r,g,o,i=s+1);else if(u)for(var f=0;f<s;++f){var l=e.charCodeAt(f);l>255&&(eg(c),t3("String has UTF-16 code units that do not fit in 8 bits")),g[c+4+f]=l}else for(var f=0;f<s;++f)g[c+4+f]=e[f];return null!==t&&t.push(eg,c),c},argPackAdvance:8,readValueFromPointer:tw,destructorFunction:function(t){eg(t)}})},v:function t(e,r,n){var o,i,a,u,s;n=tA(n),2===r?(o=L,i=J,u=K,a=function(){return w},s=1):4===r&&(o=Q,i=Y,u=Z,a=function(){return T},s=2),tk(e,{name:n,fromWireType:function(t){for(var e,n=T[t>>2],i=a(),u=t+4,c=0;c<=n;++c){var f=t+4+c*r;if(c==n||0==i[f>>s]){var l=f-u,p=o(u,l);void 0===e?e=p:(e+="\0",e+=p),u=f+r}}return eg(t),e},toWireType:function(t,e){"string"!=typeof e&&t3("Cannot pass non-string to C++ string type "+n);var o=u(e),a=em(4+o+r);return T[a>>2]=o>>s,i(e,a+4,o+r),null!==t&&t.push(eg,a),a},argPackAdvance:8,readValueFromPointer:tw,destructorFunction:function(t){eg(t)}})},u:function t(e,r,n,o,i,a){tg[e]={name:tA(r),rawConstructor:tL(n,o),rawDestructor:tL(i,a),fields:[]}},c:function t(e,r,n,o,i,a,u,s,c,f){tg[e].fields.push({fieldName:tA(r),getterReturnType:n,getter:tL(o,i),getterContext:a,setterArgumentType:u,setter:tL(s,c),setterContext:f})},J:function t(e,r){r=tA(r),tk(e,{isVoid:!0,name:r,argPackAdvance:0,fromWireType:function(){},toWireType:function(t,e){}})},m:function t(e,r,n){e=ea(e),r=eo(r,"emval::as");var o=[],i=en(o);return _[n>>2]=i,r.toWireType(o,e)},s:function t(e,r,n,o){e=ec[e],r=ea(r),n=es(n),e(r,n,null,o)},b:er,y:function t(e){return 0===e?en(ef()):(e=es(e),en(ef()[e]))},p:function t(e,r){for(var n,o,i=function t(e,r){for(var n=Array(e),o=0;o<e;++o)n[o]=eo(_[(r>>2)+o],"parameter "+o);return n}(e,r),a=i[0],u=a.name+"_$"+i.slice(1).map(function(t){return t.name}).join("_")+"$",s=["retType"],c=[a],f="",l=0;l<e-1;++l)f+=(0!==l?", ":"")+"arg"+l,s.push("argType"+l),c.push(i[1+l]);for(var p="return function "+t9("methodCaller_"+u)+"(handle, name, destructors, args) {\n",d=0,l=0;l<e-1;++l)p+="    var arg"+l+" = argType"+l+".readValueFromPointer(args"+(d?"+"+d:"")+");\n",d+=i[l+1].argPackAdvance;p+="    var rv = handle[name]("+f+");\n";for(var l=0;l<e-1;++l)i[l+1].deleteObject&&(p+="    argType"+l+".deleteObject(arg"+l+");\n");return a.isVoid||(p+="    return retType.toWireType(destructors, rv);\n"),p+="};\n",s.push(p),n=tZ(Function,s).apply(null,c),o=ec.length,ec.push(n),o},r:function t(e){return e=es(e),en(W[e])},e:function t(e,r){return e=ea(e),r=ea(r),en(e[r])},g:function t(e){e>4&&(ee[e].refcount+=1)},q:function t(e,r,n,o){e=ea(e);var i=el[r];return i||(i=function t(e){for(var r="",n=0;n<e;++n)r+=(0!==n?", ":"")+"arg"+n;for(var o="return function emval_allocator_"+e+"(constructor, argTypes, args) {\n",n=0;n<e;++n)o+="var argType"+n+" = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + "+n+'], "parameter '+n+'");\nvar arg'+n+" = argType"+n+".readValueFromPointer(args);\nargs += argType"+n+"['argPackAdvance'];\n";return Function("requireRegisteredType","Module","__emval_register",o+="var obj = new constructor("+r+");\nreturn __emval_register(obj);\n}\n")(eo,W,en)}(r),el[r]=i),i(e,n,o)},f:function t(e){return en(es(e))},l:function t(e){t$(ee[e].value),er(e)},o:function t(){tl()},E:function t(e,r,n){g.copyWithin(e,r,r+n)},F:function t(e){e>>>=0;var r=g.length;if(e>2147483648)return!1;for(var n=1;n<=4;n*=2){var o=r*(1+.2/n);o=Math.min(o,e+100663296);var i=Math.min(2147483648,X(Math.max(16777216,e,o),65536));if(ep(i))return!0}return!1},G:eh,C:function t(e,r,n,o,i){},z:function t(e,r,n,o){for(var i=0,a=0;a<n;a++){for(var u=_[r+8*a>>2],s=_[r+(8*a+4)>>2],c=0;c<s;c++)ed.printChar(e,g[u+c]);i+=s}return _[o>>2]=i,0},D:function t(e){U(0|e)}};(function t(){var e={a:ev};function r(t,e){var r=t.exports;W.asm=r,tt((h=W.asm.K).buffer),P=W.asm.L,function t(e){if(ts--,W.monitorRunDependencies&&W.monitorRunDependencies(ts),0==ts&&(null!==tc&&(clearInterval(tc),tc=null),tf)){var r=tf;tf=null,r()}}("wasm-instantiate")}function n(t){r(t.instance)}function i(t){return(!p&&(F||O)&&"function"==typeof fetch&&!th(tv)?fetch(tv,{credentials:"same-origin"}).then(function(t){if(!t.ok)throw"failed to load wasm binary file at '"+tv+"'";return t.arrayBuffer()}).catch(function(){return ty()}):Promise.resolve().then(ty)).then(function(t){return WebAssembly.instantiate(t,e)}).then(t,function(t){B("failed to asynchronously prepare wasm: "+t),tl(t)})}if(ts++,W.monitorRunDependencies&&W.monitorRunDependencies(ts),W.instantiateWasm)try{return W.instantiateWasm(e,r)}catch(a){return B("Module.instantiateWasm callback failed with error: "+a),!1}return(p||"function"!=typeof WebAssembly.instantiateStreaming||td(tv)||th(tv)||"function"!=typeof fetch?i(n):fetch(tv,{credentials:"same-origin"}).then(function(t){return WebAssembly.instantiateStreaming(t,e).then(n,function(t){return B("wasm streaming compile failed: "+t),B("falling back to ArrayBuffer instantiation"),i(n)})})).catch(o),{}})();var ey=W.___wasm_call_ctors=function(){return(ey=W.___wasm_call_ctors=W.asm.M).apply(null,arguments)},em=W._malloc=function(){return(em=W._malloc=W.asm.N).apply(null,arguments)},eg=W._free=function(){return(eg=W._free=W.asm.O).apply(null,arguments)},e$=W.___getTypeName=function(){return(e$=W.___getTypeName=W.asm.P).apply(null,arguments)},ew=W.___embind_register_native_and_builtin_types=function(){return(ew=W.___embind_register_native_and_builtin_types=W.asm.Q).apply(null,arguments)},e_=W.dynCall_jiji=function(){return(e_=W.dynCall_jiji=W.asm.R).apply(null,arguments)};function eT(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}function eb(t){t=t||S,!(ts>0)&&(function t(){if(W.preRun)for("function"==typeof W.preRun&&(W.preRun=[W.preRun]);W.preRun.length;)ta(W.preRun.shift());tm(te)}(),ts>0||(W.setStatus?(W.setStatus("Running..."),setTimeout(function(){setTimeout(function(){W.setStatus("")},1),e()},1)):e()));function e(){!A&&(A=!0,W.calledRun=!0,H||(ti=!0,tm(tr),tm(tn),n(W),W.onRuntimeInitialized&&W.onRuntimeInitialized(),function t(){if(W.postRun)for("function"==typeof W.postRun&&(W.postRun=[W.postRun]);W.postRun.length;)tu(W.postRun.shift());tm(to)}()))}}if(tf=function t(){A||eb(),A||(tf=t)},W.run=eb,W.preInit)for("function"==typeof W.preInit&&(W.preInit=[W.preInit]);W.preInit.length>0;)W.preInit.pop()();return d=!0,eb(),e.ready}}();"object"==typeof exports&&"object"==typeof module?module.exports=BASIS:"function"==typeof define&&define.amd?define([],function(){return BASIS}):"object"==typeof exports&&(exports.BASIS=BASIS);
`;



const _taskCache = new WeakMap();

let _activeLoaders = 0;

let _zstd;

class KTX2Loader extends Loader {

	constructor( manager ) {

		super( manager );

		this.transcoderPath = '';
		this.transcoderBinary = null;
		this.transcoderPending = null;

		this.workerPool = new WorkerPool();
		this.workerSourceURL = '';
		this.workerConfig = null;

		if ( typeof MSC_TRANSCODER !== 'undefined' ) {

			console.warn(

				'THREE.KTX2Loader: Please update to latest "basis_transcoder".'
				+ ' "msc_basis_transcoder" is no longer supported in three.js r125+.'

			);

		}

	}

	setTranscoderPath( path ) {

		this.transcoderPath = path;

		return this;

	}

	setWorkerLimit( num ) {

		this.workerPool.setWorkerLimit( num );

		return this;

	}

	async detectSupportAsync( renderer ) {

		this.workerConfig = {
			astcSupported: await renderer.hasFeatureAsync( 'texture-compression-astc' ),
			etc1Supported: await renderer.hasFeatureAsync( 'texture-compression-etc1' ),
			etc2Supported: await renderer.hasFeatureAsync( 'texture-compression-etc2' ),
			dxtSupported: await renderer.hasFeatureAsync( 'texture-compression-bc' ),
			bptcSupported: await renderer.hasFeatureAsync( 'texture-compression-bptc' ),
			pvrtcSupported: await renderer.hasFeatureAsync( 'texture-compression-pvrtc' )
		};

		return this;

	}

	detectSupport( renderer ) {

		if ( renderer.isWebGPURenderer === true ) {

			this.workerConfig = {
				astcSupported: renderer.hasFeature( 'texture-compression-astc' ),
				etc1Supported: renderer.hasFeature( 'texture-compression-etc1' ),
				etc2Supported: renderer.hasFeature( 'texture-compression-etc2' ),
				dxtSupported: renderer.hasFeature( 'texture-compression-bc' ),
				bptcSupported: renderer.hasFeature( 'texture-compression-bptc' ),
				pvrtcSupported: renderer.hasFeature( 'texture-compression-pvrtc' )
			};

		} else {

			this.workerConfig = {
				astcSupported: renderer.extensions.has( 'WEBGL_compressed_texture_astc' ),
				etc1Supported: renderer.extensions.has( 'WEBGL_compressed_texture_etc1' ),
				etc2Supported: renderer.extensions.has( 'WEBGL_compressed_texture_etc' ),
				dxtSupported: renderer.extensions.has( 'WEBGL_compressed_texture_s3tc' ),
				bptcSupported: renderer.extensions.has( 'EXT_texture_compression_bptc' ),
				pvrtcSupported: renderer.extensions.has( 'WEBGL_compressed_texture_pvrtc' )
					|| renderer.extensions.has( 'WEBKIT_WEBGL_compressed_texture_pvrtc' )
			};

			if ( renderer.capabilities.isWebGL2 ) {

				// https://github.com/mrdoob/three.js/pull/22928
				this.workerConfig.etc1Supported = false;

			}

		}

		return this;

	}

	init() {

		if ( ! this.transcoderPending ) {

			this.transcoderPending = Promise.all( [ basisTranscoder, basisBin ] )
				.then( ( [ jsContent, binaryContent ] ) => {

					const fn = KTX2Loader.BasisWorker.toString();

					const body = [
						'/* constants */',
						'let _EngineFormat = ' + JSON.stringify( KTX2Loader.EngineFormat ),
						'let _TranscoderFormat = ' + JSON.stringify( KTX2Loader.TranscoderFormat ),
						'let _BasisFormat = ' + JSON.stringify( KTX2Loader.BasisFormat ),
						'/* basis_transcoder.js */',
						jsContent,
						'/* worker */',
						fn.substring( fn.indexOf( '{' ) + 1, fn.lastIndexOf( '}' ) )
					].join( '\n' );

					this.workerSourceURL = URL.createObjectURL( new Blob( [ body ] ) );
					this.transcoderBinary = binaryContent;

					this.workerPool.setWorkerCreator( () => {

						const worker = new Worker( this.workerSourceURL );
						const transcoderBinary = this.transcoderBinary.slice( 0 );

						worker.postMessage( { type: 'init', config: this.workerConfig, transcoderBinary }, [ transcoderBinary ] );

						return worker;

					} );

				} );

			if ( _activeLoaders > 0 ) {

				// Each instance loads a transcoder and allocates workers, increasing network and memory cost.

				console.warn(

					'THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues.'
					+ ' Use a single KTX2Loader instance, or call .dispose() on old instances.'

				);

			}

			_activeLoaders ++;

		}

		return this.transcoderPending;

	}

	load( url, onLoad, onProgress, onError ) {

		if ( this.workerConfig === null ) {

			throw new Error( 'THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.' );

		}

		const loader = new FileLoader( this.manager );

		loader.setResponseType( 'arraybuffer' );
		loader.setWithCredentials( this.withCredentials );

		loader.load( url, ( buffer ) => {

			// Check for an existing task using this buffer. A transferred buffer cannot be transferred
			// again from this thread.
			if ( _taskCache.has( buffer ) ) {

				const cachedTask = _taskCache.get( buffer );

				return cachedTask.promise.then( onLoad ).catch( onError );

			}

			this._createTexture( buffer )
				.then( ( texture ) => onLoad ? onLoad( texture ) : null )
				.catch( onError );

		}, onProgress, onError );

	}

	_createTextureFrom( transcodeResult, container ) {

		const { faces, width, height, format, type, error, dfdFlags } = transcodeResult;

		if ( type === 'error' ) return Promise.reject( error );

		let texture;

		if ( container.faceCount === 6 ) {

			texture = new CompressedCubeTexture( faces, format, UnsignedByteType );

		} else {

			const mipmaps = faces[ 0 ].mipmaps;

			texture = container.layerCount > 1
				? new CompressedArrayTexture( mipmaps, width, height, container.layerCount, format, UnsignedByteType )
				: new CompressedTexture( mipmaps, width, height, format, UnsignedByteType );

		}

		texture.minFilter = faces[ 0 ].mipmaps.length === 1 ? LinearFilter : LinearMipmapLinearFilter;
		texture.magFilter = LinearFilter;
		texture.generateMipmaps = false;

		texture.needsUpdate = true;
		texture.colorSpace = parseColorSpace( container );
		texture.premultiplyAlpha = !! ( dfdFlags & KHR_DF_FLAG_ALPHA_PREMULTIPLIED );

		return texture;

	}

	/**
	 * @param {ArrayBuffer} buffer
	 * @param {object?} config
	 * @return {Promise<CompressedTexture|CompressedArrayTexture|DataTexture|Data3DTexture>}
	 */
	async _createTexture( buffer, config = {} ) {

		const container = read( new Uint8Array( buffer ) );

		if ( container.vkFormat !== VK_FORMAT_UNDEFINED ) {

			return createRawTexture( container );

		}

		//
		const taskConfig = config;
		const texturePending = this.init().then( () => {

			return this.workerPool.postMessage( { type: 'transcode', buffer, taskConfig: taskConfig }, [ buffer ] );

		} ).then( ( e ) => this._createTextureFrom( e.data, container ) );

		// Cache the task result.
		_taskCache.set( buffer, { promise: texturePending } );

		return texturePending;

	}

	dispose() {

		this.workerPool.dispose();
		if ( this.workerSourceURL ) URL.revokeObjectURL( this.workerSourceURL );

		_activeLoaders --;

		return this;

	}

}


/* CONSTANTS */

KTX2Loader.BasisFormat = {
	ETC1S: 0,
	UASTC_4x4: 1,
};

KTX2Loader.TranscoderFormat = {
	ETC1: 0,
	ETC2: 1,
	BC1: 2,
	BC3: 3,
	BC4: 4,
	BC5: 5,
	BC7_M6_OPAQUE_ONLY: 6,
	BC7_M5: 7,
	PVRTC1_4_RGB: 8,
	PVRTC1_4_RGBA: 9,
	ASTC_4x4: 10,
	ATC_RGB: 11,
	ATC_RGBA_INTERPOLATED_ALPHA: 12,
	RGBA32: 13,
	RGB565: 14,
	BGR565: 15,
	RGBA4444: 16,
};

KTX2Loader.EngineFormat = {
	RGBAFormat: RGBAFormat,
	RGBA_ASTC_4x4_Format: RGBA_ASTC_4x4_Format,
	RGBA_BPTC_Format: RGBA_BPTC_Format,
	RGBA_ETC2_EAC_Format: RGBA_ETC2_EAC_Format,
	RGBA_PVRTC_4BPPV1_Format: RGBA_PVRTC_4BPPV1_Format,
	RGBA_S3TC_DXT5_Format: RGBA_S3TC_DXT5_Format,
	RGB_ETC1_Format: RGB_ETC1_Format,
	RGB_ETC2_Format: RGB_ETC2_Format,
	RGB_PVRTC_4BPPV1_Format: RGB_PVRTC_4BPPV1_Format,
	RGB_S3TC_DXT1_Format: RGB_S3TC_DXT1_Format,
};


/* WEB WORKER */

KTX2Loader.BasisWorker = function () {

	let config;
	let transcoderPending;
	let BasisModule;

	const EngineFormat = _EngineFormat; // eslint-disable-line no-undef
	const TranscoderFormat = _TranscoderFormat; // eslint-disable-line no-undef
	const BasisFormat = _BasisFormat; // eslint-disable-line no-undef

	self.addEventListener( 'message', function ( e ) {

		const message = e.data;

		switch ( message.type ) {

			case 'init':
				config = message.config;
				init( message.transcoderBinary );
				break;

			case 'transcode':
				transcoderPending.then( () => {

					try {

						const { faces, buffers, width, height, hasAlpha, format, dfdFlags } = transcode( message.buffer );

						self.postMessage( { type: 'transcode', id: message.id, faces, width, height, hasAlpha, format, dfdFlags }, buffers );

					} catch ( error ) {

						console.error( error );

						self.postMessage( { type: 'error', id: message.id, error: error.message } );

					}

				} );
				break;

		}

	} );

	function init( wasmBinary ) {

		transcoderPending = new Promise( ( resolve ) => {

			BasisModule = { wasmBinary, onRuntimeInitialized: resolve };
			BASIS( BasisModule ); // eslint-disable-line no-undef

		} ).then( () => {

			BasisModule.initializeBasis();

			if ( BasisModule.KTX2File === undefined ) {

				console.warn( 'THREE.KTX2Loader: Please update Basis Universal transcoder.' );

			}

		} );

	}

	function transcode( buffer ) {

		const ktx2File = new BasisModule.KTX2File( new Uint8Array( buffer ) );

		function cleanup() {

			ktx2File.close();
			ktx2File.delete();

		}

		if ( ! ktx2File.isValid() ) {

			cleanup();
			throw new Error( 'THREE.KTX2Loader:	Invalid or unsupported .ktx2 file' );

		}

		const basisFormat = ktx2File.isUASTC() ? BasisFormat.UASTC_4x4 : BasisFormat.ETC1S;
		const width = ktx2File.getWidth();
		const height = ktx2File.getHeight();
		const layerCount = ktx2File.getLayers() || 1;
		const levelCount = ktx2File.getLevels();
		const faceCount = ktx2File.getFaces();
		const hasAlpha = ktx2File.getHasAlpha();
		const dfdFlags = ktx2File.getDFDFlags();

		const { transcoderFormat, engineFormat } = getTranscoderFormat( basisFormat, width, height, hasAlpha );

		if ( ! width || ! height || ! levelCount ) {

			cleanup();
			throw new Error( 'THREE.KTX2Loader:	Invalid texture' );

		}

		if ( ! ktx2File.startTranscoding() ) {

			cleanup();
			throw new Error( 'THREE.KTX2Loader: .startTranscoding failed' );

		}

		const faces = [];
		const buffers = [];

		for ( let face = 0; face < faceCount; face ++ ) {

			const mipmaps = [];

			for ( let mip = 0; mip < levelCount; mip ++ ) {

				const layerMips = [];

				let mipWidth, mipHeight;

				for ( let layer = 0; layer < layerCount; layer ++ ) {

					const levelInfo = ktx2File.getImageLevelInfo( mip, layer, face );

					if ( face === 0 && mip === 0 && layer === 0 && ( levelInfo.origWidth % 4 !== 0 || levelInfo.origHeight % 4 !== 0 ) ) {

						console.warn( 'THREE.KTX2Loader: ETC1S and UASTC textures should use multiple-of-four dimensions.' );

					}

					if ( levelCount > 1 ) {

						mipWidth = levelInfo.origWidth;
						mipHeight = levelInfo.origHeight;

					} else {

						// Handles non-multiple-of-four dimensions in textures without mipmaps. Textures with
						// mipmaps must use multiple-of-four dimensions, for some texture formats and APIs.
						// See mrdoob/three.js#25908.
						mipWidth = levelInfo.width;
						mipHeight = levelInfo.height;

					}

					const dst = new Uint8Array( ktx2File.getImageTranscodedSizeInBytes( mip, layer, 0, transcoderFormat ) );
					const status = ktx2File.transcodeImage( dst, mip, layer, face, transcoderFormat, 0, - 1, - 1 );

					if ( ! status ) {

						cleanup();
						throw new Error( 'THREE.KTX2Loader: .transcodeImage failed.' );

					}

					layerMips.push( dst );

				}

				const mipData = concat( layerMips );

				mipmaps.push( { data: mipData, width: mipWidth, height: mipHeight } );
				buffers.push( mipData.buffer );

			}

			faces.push( { mipmaps, width, height, format: engineFormat } );

		}

		cleanup();

		return { faces, buffers, width, height, hasAlpha, format: engineFormat, dfdFlags };

	}

	//

	// Optimal choice of a transcoder target format depends on the Basis format (ETC1S or UASTC),
	// device capabilities, and texture dimensions. The list below ranks the formats separately
	// for ETC1S and UASTC.
	//
	// In some cases, transcoding UASTC to RGBA32 might be preferred for higher quality (at
	// significant memory cost) compared to ETC1/2, BC1/3, and PVRTC. The transcoder currently
	// chooses RGBA32 only as a last resort and does not expose that option to the caller.
	const FORMAT_OPTIONS = [
		{
			if: 'astcSupported',
			basisFormat: [ BasisFormat.UASTC_4x4 ],
			transcoderFormat: [ TranscoderFormat.ASTC_4x4, TranscoderFormat.ASTC_4x4 ],
			engineFormat: [ EngineFormat.RGBA_ASTC_4x4_Format, EngineFormat.RGBA_ASTC_4x4_Format ],
			priorityETC1S: Infinity,
			priorityUASTC: 1,
			needsPowerOfTwo: false,
		},
		{
			if: 'bptcSupported',
			basisFormat: [ BasisFormat.ETC1S, BasisFormat.UASTC_4x4 ],
			transcoderFormat: [ TranscoderFormat.BC7_M5, TranscoderFormat.BC7_M5 ],
			engineFormat: [ EngineFormat.RGBA_BPTC_Format, EngineFormat.RGBA_BPTC_Format ],
			priorityETC1S: 3,
			priorityUASTC: 2,
			needsPowerOfTwo: false,
		},
		{
			if: 'dxtSupported',
			basisFormat: [ BasisFormat.ETC1S, BasisFormat.UASTC_4x4 ],
			transcoderFormat: [ TranscoderFormat.BC1, TranscoderFormat.BC3 ],
			engineFormat: [ EngineFormat.RGB_S3TC_DXT1_Format, EngineFormat.RGBA_S3TC_DXT5_Format ],
			priorityETC1S: 4,
			priorityUASTC: 5,
			needsPowerOfTwo: false,
		},
		{
			if: 'etc2Supported',
			basisFormat: [ BasisFormat.ETC1S, BasisFormat.UASTC_4x4 ],
			transcoderFormat: [ TranscoderFormat.ETC1, TranscoderFormat.ETC2 ],
			engineFormat: [ EngineFormat.RGB_ETC2_Format, EngineFormat.RGBA_ETC2_EAC_Format ],
			priorityETC1S: 1,
			priorityUASTC: 3,
			needsPowerOfTwo: false,
		},
		{
			if: 'etc1Supported',
			basisFormat: [ BasisFormat.ETC1S, BasisFormat.UASTC_4x4 ],
			transcoderFormat: [ TranscoderFormat.ETC1 ],
			engineFormat: [ EngineFormat.RGB_ETC1_Format ],
			priorityETC1S: 2,
			priorityUASTC: 4,
			needsPowerOfTwo: false,
		},
		{
			if: 'pvrtcSupported',
			basisFormat: [ BasisFormat.ETC1S, BasisFormat.UASTC_4x4 ],
			transcoderFormat: [ TranscoderFormat.PVRTC1_4_RGB, TranscoderFormat.PVRTC1_4_RGBA ],
			engineFormat: [ EngineFormat.RGB_PVRTC_4BPPV1_Format, EngineFormat.RGBA_PVRTC_4BPPV1_Format ],
			priorityETC1S: 5,
			priorityUASTC: 6,
			needsPowerOfTwo: true,
		},
	];

	const ETC1S_OPTIONS = FORMAT_OPTIONS.sort( function ( a, b ) {

		return a.priorityETC1S - b.priorityETC1S;

	} );
	const UASTC_OPTIONS = FORMAT_OPTIONS.sort( function ( a, b ) {

		return a.priorityUASTC - b.priorityUASTC;

	} );

	function getTranscoderFormat( basisFormat, width, height, hasAlpha ) {

		let transcoderFormat;
		let engineFormat;

		const options = basisFormat === BasisFormat.ETC1S ? ETC1S_OPTIONS : UASTC_OPTIONS;

		for ( let i = 0; i < options.length; i ++ ) {

			const opt = options[ i ];

			if ( ! config[ opt.if ] ) continue;
			if ( ! opt.basisFormat.includes( basisFormat ) ) continue;
			if ( hasAlpha && opt.transcoderFormat.length < 2 ) continue;
			if ( opt.needsPowerOfTwo && ! ( isPowerOfTwo( width ) && isPowerOfTwo( height ) ) ) continue;

			transcoderFormat = opt.transcoderFormat[ hasAlpha ? 1 : 0 ];
			engineFormat = opt.engineFormat[ hasAlpha ? 1 : 0 ];

			return { transcoderFormat, engineFormat };

		}

		console.warn( 'THREE.KTX2Loader: No suitable compressed texture format found. Decoding to RGBA32.' );

		transcoderFormat = TranscoderFormat.RGBA32;
		engineFormat = EngineFormat.RGBAFormat;

		return { transcoderFormat, engineFormat };

	}

	function isPowerOfTwo( value ) {

		if ( value <= 2 ) return true;

		return ( value & ( value - 1 ) ) === 0 && value !== 0;

	}

	/** Concatenates N byte arrays. */
	function concat( arrays ) {

		if ( arrays.length === 1 ) return arrays[ 0 ];

		let totalByteLength = 0;

		for ( let i = 0; i < arrays.length; i ++ ) {

			const array = arrays[ i ];
			totalByteLength += array.byteLength;

		}

		const result = new Uint8Array( totalByteLength );

		let byteOffset = 0;

		for ( let i = 0; i < arrays.length; i ++ ) {

			const array = arrays[ i ];
			result.set( array, byteOffset );

			byteOffset += array.byteLength;

		}

		return result;

	}

};

//
// Parsing for non-Basis textures. These textures are may have supercompression
// like Zstd, but they do not require transcoding.

const UNCOMPRESSED_FORMATS = new Set( [ RGBAFormat, RGFormat, RedFormat ] );

const FORMAT_MAP = {

	[ VK_FORMAT_R32G32B32A32_SFLOAT ]: RGBAFormat,
	[ VK_FORMAT_R16G16B16A16_SFLOAT ]: RGBAFormat,
	[ VK_FORMAT_R8G8B8A8_UNORM ]: RGBAFormat,
	[ VK_FORMAT_R8G8B8A8_SRGB ]: RGBAFormat,

	[ VK_FORMAT_R32G32_SFLOAT ]: RGFormat,
	[ VK_FORMAT_R16G16_SFLOAT ]: RGFormat,
	[ VK_FORMAT_R8G8_UNORM ]: RGFormat,
	[ VK_FORMAT_R8G8_SRGB ]: RGFormat,

	[ VK_FORMAT_R32_SFLOAT ]: RedFormat,
	[ VK_FORMAT_R16_SFLOAT ]: RedFormat,
	[ VK_FORMAT_R8_SRGB ]: RedFormat,
	[ VK_FORMAT_R8_UNORM ]: RedFormat,

	[ VK_FORMAT_ASTC_6x6_SRGB_BLOCK ]: RGBA_ASTC_6x6_Format,
	[ VK_FORMAT_ASTC_6x6_UNORM_BLOCK ]: RGBA_ASTC_6x6_Format,

};

const TYPE_MAP = {

	[ VK_FORMAT_R32G32B32A32_SFLOAT ]: FloatType,
	[ VK_FORMAT_R16G16B16A16_SFLOAT ]: HalfFloatType,
	[ VK_FORMAT_R8G8B8A8_UNORM ]: UnsignedByteType,
	[ VK_FORMAT_R8G8B8A8_SRGB ]: UnsignedByteType,

	[ VK_FORMAT_R32G32_SFLOAT ]: FloatType,
	[ VK_FORMAT_R16G16_SFLOAT ]: HalfFloatType,
	[ VK_FORMAT_R8G8_UNORM ]: UnsignedByteType,
	[ VK_FORMAT_R8G8_SRGB ]: UnsignedByteType,

	[ VK_FORMAT_R32_SFLOAT ]: FloatType,
	[ VK_FORMAT_R16_SFLOAT ]: HalfFloatType,
	[ VK_FORMAT_R8_SRGB ]: UnsignedByteType,
	[ VK_FORMAT_R8_UNORM ]: UnsignedByteType,

	[ VK_FORMAT_ASTC_6x6_SRGB_BLOCK ]: UnsignedByteType,
	[ VK_FORMAT_ASTC_6x6_UNORM_BLOCK ]: UnsignedByteType,

};

async function createRawTexture( container ) {

	const { vkFormat } = container;

	if ( FORMAT_MAP[ vkFormat ] === undefined ) {

		throw new Error( 'THREE.KTX2Loader: Unsupported vkFormat.' );

	}

	//

	let zstd;

	if ( container.supercompressionScheme === KHR_SUPERCOMPRESSION_ZSTD ) {

		if ( ! _zstd ) {

			_zstd = new Promise( async ( resolve ) => {

				const zstd = new ZSTDDecoder();
				await zstd.init();
				resolve( zstd );

			} );

		}

		zstd = await _zstd;

	}

	//

	const mipmaps = [];


	for ( let levelIndex = 0; levelIndex < container.levels.length; levelIndex ++ ) {

		const levelWidth = Math.max( 1, container.pixelWidth >> levelIndex );
		const levelHeight = Math.max( 1, container.pixelHeight >> levelIndex );
		const levelDepth = container.pixelDepth ? Math.max( 1, container.pixelDepth >> levelIndex ) : 0;

		const level = container.levels[ levelIndex ];

		let levelData;

		if ( container.supercompressionScheme === KHR_SUPERCOMPRESSION_NONE ) {

			levelData = level.levelData;

		} else if ( container.supercompressionScheme === KHR_SUPERCOMPRESSION_ZSTD ) {

			levelData = zstd.decode( level.levelData, level.uncompressedByteLength );

		} else {

			throw new Error( 'THREE.KTX2Loader: Unsupported supercompressionScheme.' );

		}

		let data;

		if ( TYPE_MAP[ vkFormat ] === FloatType ) {

			data = new Float32Array(

				levelData.buffer,
				levelData.byteOffset,
				levelData.byteLength / Float32Array.BYTES_PER_ELEMENT

			);

		} else if ( TYPE_MAP[ vkFormat ] === HalfFloatType ) {

			data = new Uint16Array(

				levelData.buffer,
				levelData.byteOffset,
				levelData.byteLength / Uint16Array.BYTES_PER_ELEMENT

			);

		} else {

			data = levelData;

		}

		mipmaps.push( {

			data: data,
			width: levelWidth,
			height: levelHeight,
			depth: levelDepth,

		} );

	}

	let texture;

	if ( UNCOMPRESSED_FORMATS.has( FORMAT_MAP[ vkFormat ] ) ) {

		texture = container.pixelDepth === 0
			? new DataTexture( mipmaps[ 0 ].data, container.pixelWidth, container.pixelHeight )
			: new Data3DTexture( mipmaps[ 0 ].data, container.pixelWidth, container.pixelHeight, container.pixelDepth );

	} else {

		if ( container.pixelDepth > 0 ) throw new Error( 'THREE.KTX2Loader: Unsupported pixelDepth.' );

		texture = new CompressedTexture( mipmaps, container.pixelWidth, container.pixelHeight );

	}

	texture.mipmaps = mipmaps;

	texture.type = TYPE_MAP[ vkFormat ];
	texture.format = FORMAT_MAP[ vkFormat ];
	texture.colorSpace = parseColorSpace( container );
	texture.needsUpdate = true;

	//

	return Promise.resolve( texture );

}

function parseColorSpace( container ) {

	const dfd = container.dataFormatDescriptor[ 0 ];

	if ( dfd.colorPrimaries === KHR_DF_PRIMARIES_BT709 ) {

		return dfd.transferFunction === KHR_DF_TRANSFER_SRGB ? SRGBColorSpace : LinearSRGBColorSpace;

	} else if ( dfd.colorPrimaries === KHR_DF_PRIMARIES_DISPLAYP3 ) {

		return dfd.transferFunction === KHR_DF_TRANSFER_SRGB ? DisplayP3ColorSpace : LinearDisplayP3ColorSpace;

	} else if ( dfd.colorPrimaries === KHR_DF_PRIMARIES_UNSPECIFIED ) {

		return NoColorSpace;

	} else {

		console.warn( `THREE.KTX2Loader: Unsupported color primaries, "${ dfd.colorPrimaries }"` );
		return NoColorSpace;

	}

}

export { KTX2Loader };
