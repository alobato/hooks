import { useEffect, useRef, useCallback } from 'react'
import isEqual from 'lodash.isequal'
import usePrevious from './usePrevious'

function useIgnoreMount(state, callback) {
  const didMountRef = useRef(false)
  const previousState = usePrevious(state)
  const fn = useCallback(callback, [callback])
  useEffect(() => {
    if (didMountRef.current && !isEqual(previousState, state)) {
      fn(state)
    } else {
      didMountRef.current = true
    }
  }, [state, fn, previousState])
}

export default useIgnoreMount
