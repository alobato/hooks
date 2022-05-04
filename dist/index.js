var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  useCallOnVisible: () => useCallOnVisible_default,
  useDebounce: () => useDebounce_default,
  useIgnoreMount: () => useIgnoreMount_default,
  useLocalStorage: () => useLocalStorage_default,
  useLockBodyScroll: () => useLockBodyScroll_default,
  usePrevious: () => usePrevious_default,
  useScrollPosition: () => useScrollPosition_default
});
module.exports = __toCommonJS(src_exports);

// src/useDebounce.js
var import_react = require("react");
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
  (0, import_react.useEffect)(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
var useDebounce_default = useDebounce;

// src/usePrevious.js
var import_react2 = require("react");
function usePrevious(value) {
  const ref = (0, import_react2.useRef)();
  (0, import_react2.useEffect)(() => {
    ref.current = value;
  });
  return ref.current;
}
var usePrevious_default = usePrevious;

// src/useIgnoreMount.js
var import_react3 = require("react");
var import_lodash = __toESM(require("lodash.isequal"));
function useIgnoreMount(state, callback) {
  const didMountRef = (0, import_react3.useRef)(false);
  const previousState = usePrevious_default(state);
  const fn = (0, import_react3.useCallback)(callback, [callback]);
  (0, import_react3.useEffect)(() => {
    if (didMountRef.current && !(0, import_lodash.default)(previousState, state)) {
      fn(state);
    } else {
      didMountRef.current = true;
    }
  }, [state, fn, previousState]);
}
var useIgnoreMount_default = useIgnoreMount;

// src/useLocalStorage.js
var import_react4 = require("react");
function useLocalStorage(key, initialValue) {
  const [items, setItems] = (0, import_react4.useState)(() => window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : initialValue);
  (0, import_react4.useEffect)(() => {
    window.localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);
  return [items, setItems];
}
var useLocalStorage_default = useLocalStorage;

// src/useScrollPosition.js
var import_react5 = require("react");
var zeroPosition = { x: 0, y: 0 };
var getClientRect = (element) => element == null ? void 0 : element.getBoundingClientRect();
var getScrollPosition = ({ element, useWindow, boundingElement }) => {
  if (useWindow) {
    return { x: window.scrollX, y: window.scrollY };
  }
  const targetPosition = getClientRect((element == null ? void 0 : element.current) || document.body);
  const containerPosition = getClientRect(boundingElement == null ? void 0 : boundingElement.current);
  if (!targetPosition) {
    return zeroPosition;
  }
  return containerPosition ? {
    x: (containerPosition.x || 0) - (targetPosition.x || 0),
    y: (containerPosition.y || 0) - (targetPosition.y || 0)
  } : { x: targetPosition.left, y: targetPosition.top };
};
var useScrollPosition = (effect, deps, element, boundingElement) => {
  const useWindow = false;
  const position = (0, import_react5.useRef)(getScrollPosition({ element, useWindow, boundingElement }));
  const throttleTimeout = (0, import_react5.useRef)();
  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow, boundingElement });
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    throttleTimeout.current = null;
  };
  (0, import_react5.useEffect)(() => {
    var _a;
    const handleScroll = () => {
      throttleTimeout.current = window.setTimeout(callBack, 100);
    };
    (_a = boundingElement.current) == null ? void 0 : _a.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => {
      var _a2;
      (_a2 = boundingElement.current) == null ? void 0 : _a2.removeEventListener("scroll", handleScroll);
    };
  }, deps);
};
var useScrollPosition_default = useScrollPosition;

// src/useCallOnVisible.js
var import_react6 = __toESM(require("react"));
function useCallOnVisible(func) {
  import_react6.default.useEffect(() => {
    const handleVisibilityChange = (e) => {
      if (typeof document.hidden !== "undefined" && !document.hidden) {
        func();
      }
    };
    if (typeof document.addEventListener !== "undefined" && typeof document.hidden !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange, false);
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [func]);
}
var useCallOnVisible_default = useCallOnVisible;

// src/useLockBodyScroll.js
var import_react7 = require("react");
function getClosestBody(el) {
  if (!el) {
    return null;
  } else if (el.tagName === "BODY") {
    return el;
  } else if (el.tagName === "IFRAME") {
    const document2 = el.contentDocument;
    return document2 ? document2.body : null;
  } else if (!el.offsetParent) {
    return null;
  }
  return getClosestBody(el.offsetParent);
}
function preventDefault(rawEvent) {
  const e = rawEvent || window.event;
  if (e.touches.length > 1)
    return true;
  if (e.preventDefault)
    e.preventDefault();
  return false;
}
var isIosDevice = typeof window !== "undefined" && window.navigator && window.navigator.platform && /iP(ad|hone|od)/.test(window.navigator.platform);
var bodies = /* @__PURE__ */ new Map();
var doc = typeof document === "object" ? document : void 0;
var documentListenerAdded = false;
function useLockBody(locked = true, elementRef) {
  elementRef = (0, import_react7.useRef)(doc.body);
  const lock = (body) => {
    const bodyInfo = bodies.get(body);
    if (!bodyInfo) {
      bodies.set(body, { counter: 1, initialOverflow: body.style.overflow });
      if (isIosDevice) {
        if (!documentListenerAdded) {
          document.addEventListener("touchmove", preventDefault, {
            passive: false
          });
          documentListenerAdded = true;
        }
      } else {
        body.style.overflow = "hidden";
      }
    } else {
      bodies.set(body, {
        counter: bodyInfo.counter + 1,
        initialOverflow: bodyInfo.initialOverflow
      });
    }
  };
  const unlock = (body) => {
    const bodyInfo = bodies.get(body);
    if (bodyInfo) {
      if (bodyInfo.counter === 1) {
        bodies.delete(body);
        if (isIosDevice) {
          body.ontouchmove = null;
          if (documentListenerAdded) {
            document.removeEventListener("touchmove", preventDefault);
            documentListenerAdded = false;
          }
        } else {
          body.style.overflow = bodyInfo.initialOverflow;
        }
      } else {
        bodies.set(body, {
          counter: bodyInfo.counter - 1,
          initialOverflow: bodyInfo.initialOverflow
        });
      }
    }
  };
  (0, import_react7.useEffect)(() => {
    const body = getClosestBody(elementRef.current);
    if (!body)
      return;
    if (locked) {
      lock(body);
    } else {
      unlock(body);
    }
  }, [locked, elementRef.current]);
  (0, import_react7.useEffect)(() => {
    const body = getClosestBody(elementRef.current);
    if (!body)
      return;
    return () => {
      unlock(body);
    };
  }, []);
}
var useLockBodyScroll_default = useLockBody;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCallOnVisible,
  useDebounce,
  useIgnoreMount,
  useLocalStorage,
  useLockBodyScroll,
  usePrevious,
  useScrollPosition
});
