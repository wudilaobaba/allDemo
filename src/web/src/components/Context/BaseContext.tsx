import React, {createContext, FC, useReducer} from 'react'

/**
 * 基类
 * D 就是store中的数据类型
 */

type BaseContextType<D> = {
  dispatch: (payload: Partial<D>) => void,
  data: D
}

interface BaseActionType<D> {
  payload: Partial<D>
}

export function createContextContainer<D>(initData: D) {
  const Context = createContext<BaseContextType<D>>({
    dispatch: () => undefined,
    data: initData
  })

  const ContextContainer: FC<any> = ({children}) => {
    const reducer = (state: D, action: BaseActionType<D>) => {
      const {payload} = action
      return {...state, ...payload};
    }
    const [data, originDispatch] = useReducer(reducer, initData);
    const dispatch = (payload: BaseActionType<D>['payload']) => originDispatch({payload})
    return <Context.Provider value={{data, dispatch}} children={children}/>
  }

  return {ContextContainer, Context};
}
