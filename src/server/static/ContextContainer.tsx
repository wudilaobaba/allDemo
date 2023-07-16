import {createContextContainer} from './BaseContext'
type DataType = {
  // 可以在这里定义需要的store数据，这里初始化一个叫做init的字符串类型
  init: string;
}

/** reducer初始值 */
const initData: DataType = {
  init: "hello world"
}

/**
 * 应用两处：
 * 01. ContextContainer: 应用于页面作为容器组件；
 *     import {ContextContainer} from '@/components/Context/PermissionContextContainer'
 *
 * 02. Context : 应用于useStore钩子函数中；
 *     import {Context as PermissionContext} from '@/components/Context/PermissionContextContainer'
 */
export const {ContextContainer, Context} = createContextContainer<DataType>(initData)
