// src/useDebounce.js
import { useState, useEffect } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
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
import { useEffect as useEffect2, useRef } from "react";
function usePrevious(value) {
  const ref = useRef();
  useEffect2(() => {
    ref.current = value;
  });
  return ref.current;
}
var usePrevious_default = usePrevious;

// src/useIgnoreMount.js
import { useEffect as useEffect3, useRef as useRef2, useCallback } from "react";
import isEqual from "lodash.isequal";
function useIgnoreMount(state, callback) {
  const didMountRef = useRef2(false);
  const previousState = usePrevious_default(state);
  const fn = useCallback(callback, [callback]);
  useEffect3(() => {
    if (didMountRef.current && !isEqual(previousState, state)) {
      fn(state);
    } else {
      didMountRef.current = true;
    }
  }, [state, fn, previousState]);
}
var useIgnoreMount_default = useIgnoreMount;

// src/useLocalStorage.js
import { useEffect as useEffect4, useState as useState2 } from "react";
function useLocalStorage(key, initialValue) {
  const [items, setItems] = useState2(() => window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : initialValue);
  useEffect4(() => {
    window.localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);
  return [items, setItems];
}
var useLocalStorage_default = useLocalStorage;

// src/useScrollPosition.js
import { useEffect as useEffect5, useRef as useRef3 } from "react";
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
  const position = useRef3(getScrollPosition({ element, useWindow, boundingElement }));
  const throttleTimeout = useRef3();
  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow, boundingElement });
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    throttleTimeout.current = null;
  };
  useEffect5(() => {
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
import React from "react";
function useCallOnVisible(func) {
  React.useEffect(() => {
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
import { useEffect as useEffect6, useRef as useRef4 } from "react";
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
  elementRef = useRef4(doc.body);
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
  useEffect6(() => {
    const body = getClosestBody(elementRef.current);
    if (!body)
      return;
    if (locked) {
      lock(body);
    } else {
      unlock(body);
    }
  }, [locked, elementRef.current]);
  useEffect6(() => {
    const body = getClosestBody(elementRef.current);
    if (!body)
      return;
    return () => {
      unlock(body);
    };
  }, []);
}
var useLockBodyScroll_default = useLockBody;
export {
  useCallOnVisible_default as useCallOnVisible,
  useDebounce_default as useDebounce,
  useIgnoreMount_default as useIgnoreMount,
  useLocalStorage_default as useLocalStorage,
  useLockBodyScroll_default as useLockBodyScroll,
  usePrevious_default as usePrevious,
  useScrollPosition_default as useScrollPosition
};
