import axios from 'axios'
import NProgress from 'nprogress'

const service = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1',
  timeout: 5000
})

// axios请求拦截
service.interceptors.request.use(config => {
  // 为请求头对象，添加Token验证的Authorization字段
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

service.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 登陆接口
export const login = ({ username, password }) => {
  return service.post('/login', {
    username,
    password
  }).then(res => {
    if (res.status === 200) {
      return res.data
    }
  })
}

// 获取左侧菜单列表
export const getMenuList = async () => {
  const res = await service.get('/menus')
  if (res.status === 200) {
    return res.data
  }
}

// 获取用户列表
export const getUsers = async ({ query, pagenum, pagesize }) => {
  const res = await service.get('/users', {
    params: {
      query,
      pagenum,
      pagesize
    }
  })
  if (res.status === 200) {
    return res.data
  }
}

export const userStateChange = async (id, type) => {
  return service.put(`/users/${id}/state/${type}`).then(res => {
    if (res.status === 200) {
      return res.data
    }
  })
}

export const addUser = async ({ username, password, email, mobile }) => {
  const res = await service.post('/users', {
    username,
    password,
    email,
    mobile
  })
  if (res.status === 200)
    return res.data
}

export const getUserInfoById = async id => {
  const res = await service.get(`/users/${id}`)
  if (res.status === 200) {
    return res.data
  }
}

// 修改用户信息
export const editUserInfo = async ({ id, email, mobile }) => {
  const res = await service.put(`/users/${id}`, {
    email,
    mobile
  })
  if (res.status === 200) {
    return res.data
  }
}

export const deleteUser = async (id) => {
  const res = await service.delete(`/users/${id}`)
  if (res.status === 200) {
    return res.data
  }
}

// 请求管理权限列表
export const getRightsList = async (type) => {
  const res = await service.get(`/rights/${type}`)
  if (res.status === 200) {
    return res.data
  }
}

// 获取所有角色列表的数据
export const getRolesList = async () => {
  const res = await service.get('/roles')
  if (res.status === 200) {
    return res.data
  }
}

// 编辑提交角色
export const editRole = async ({ id, roleName, roleDesc }) => {
  const res = await service.put(`/roles/${id}`, {
    roleName,
    roleDesc
  })
  if (res.status === 200) {
    return res.data
  }
}

// 删除角色
export const deleteRoleById = async id => {
  const res = await service.delete(`/roles/${id}`)
  if (res.status === 200) {
    return res.data
  }
}

export const addRole = async ({ roleName, roleDesc }) => {
  const res = await service.post('/roles', {
    roleName,
    roleDesc
  })
  if (res.status === 200) {
    return res.data
  }
}

// - 请求路径：roles/:roleId/rights/:rightId
// - 请求方法：delete
// 删除指定id的角色的权限
export const deleteRoleRightsById = async (roleId, rightId) => {
  const res = await service.delete(`roles/${roleId}/rights/${rightId}`)
  if (res.status === 200) {
    return res.data
  }
}

// 请求所有权限列表 -> 树形结构 type: tree
export const getAllRightsTree = async (type) => {
  const res = await service.get(`/rights/${type}`)
  if (res.status === 200) {
    return res.data
  }
}

// 角色授权
export const getRoleRights = async (roleId, rids) => {
  const res = await service.post(`/roles/${roleId}/rights`, {
    rids
  })
  if (res.status === 200) {
    return res.data
  }
}

// 分配用户角色
export const getUserRole = async (id, rid) => {
  const res = await service.put(`/users/${id}/role`, {
    rid
  })
  if (res.status === 200) {
    return res.data
  }
}

// 请求商品分类列表
export const getCategoryList = async ({ type, pagenum, pagesize = '' }) => {
  const res = await service.get(`/categories`, {
    params: {
      type,
      pagenum,
      pagesize
    }
  })
  if (res.status === 200) {
    return res.data
  }
}

export const getCategoryListNull = async () => {
  const res = await service.get(`/categories`)
  if (res.status === 200) {
    return res.data
  }
}

// 添加分类category
export const addCategories = async ({ cat_pid, cat_name, cat_level }) => {
  const res = await service.post('/categories', {
    cat_pid,
    cat_name,
    cat_level,
  })
  if (res.status === 200) {
    return res.data
  }
}

// 删除分类
export const deleteCate = (id) => {
  return service.delete(`/categories/${id}`).then(res => {
    if (res.status === 200) {
      return res.data
    }
  })
}

// 
export const getCategoryListOnlyOrMany = async (id, sel) => {
  const res = await service.get(`categories/${id}/attributes`, {
    params: {
      sel
    }
  })
  if (res.status === 200) {
    return res.data
  }
}

// 添加动态参数或者静态属性
// - 请求路径：categories/:id/attributes
// - 请求方法：post        |
export const addCategoryAttributed = async (id, attr_name, attr_sel, attr_vals) => {
  let res = null
  if (attr_vals) {
    // many
    res = await service.post(`/categories/${id}/attributes`, {
      attr_name,
      attr_sel,
      attr_vals
    })
  } else {
    // only
    res = await service.post(`/categories/${id}/attributes`, {
      attr_name,
      attr_sel
    })
  }
  if (res.status === 200) {
    return res.data
  }
}

// 根据id查询参数
export const getAttributesById = async (id, attrId, attr_sel, attr_vals) => {
  let res = null
  if (attr_vals) {
    res = await service.get(`/categories/${id}/attributes/${attrId}`, {
      params: {
        attr_sel,
        attr_vals
      }
    })
  } else {
    res = await service.get(`/categories/${id}/attributes/${attrId}`, {
      params: { attr_sel }
    })
  }
  if (res.status === 200) {
    return res.data
  }
}

// 编辑提交参数
export const submitCategoryAttributes = async (id, attrId, attr_name, attr_sel, attr_vals) => {
  let res = null
  if (attr_vals) {
    res = await service.put(`/categories/${id}/attributes/${attrId}`, {
      attr_name,
      attr_sel,
      attr_vals
    })
  } else {
    res = await service.put(`/categories/${id}/attributes/${attrId}`, {
      attr_name,
      attr_sel
    })
  }
  if (res.status === 200) {
    return res.data
  }
}

// 删除参数
export const deleteCategoryAttributes = async (id, attid) => {
  const res = await service.delete(`/categories/${id}/attributes/${attid}`)
  if (res.status === 200) {
    return res.data
  }
}

// 编辑提交参数
export const editSubmitAttributes = async (id, attrid, attr_name, attr_sel, attr_vals) => {
  let res = null
  if (attr_vals) {
    res = await service.put(`/categories/${id}/attributes/${attrid}`, {
      attr_name,
      attr_sel,
      attr_vals
    })
  } else {
    res = await service.put(`/categories/${id}/attributes/${attrid}`, {
      attr_name,
      attr_sel
    })
  }
  if (res.status === 200) {
    return res.data
  }
}

// 商品列表数据
export const getGoodsList = async ({ query, pagenum, pagesize }) => {
  let res = null
  if (query) {
    // 当query存在
    res = await service.get(`/goods`, {
      params: {
        query,
        pagenum,
        pagesize
      }
    })
  } else {
    res = await service.get(`/goods`, {
      params: {
        pagenum,
        pagesize
      }
    })
  }
  if (res.status === 200) {
    return res.data
  }
}

// 删除商品
export const deleteGoodsById = async id => {
  const res = await service.delete(`/goods/${id}`)
  if (res.status === 200) {
    return res.data
  }
}

// 添加商品
// | 参数名           | 参数说明                                            | 备注     |
// | --------------- | ------------------------------------------------- | -------- |
// | goods_name      | 商品名称                                            | 不能为空 |
// | goods_cat       | 以为','分割的分类列表                                | 不能为空 |
// | goods_price     | 价格                                               | 不能为空 |
// | goods_number    | 数量                                               | 不能为空 |
// | goods_weight    | 重量                                               | 不能为空 |
// | goods_introduce | 介绍                                               | 可以为空 |
// | pics            | 上传的图片临时路径（对象）                             | 可以为空 |
// | attrs           | 商品的参数（数组），包含 `动态参数` 和 `静态属性`         | 可以为空 |
export const addGoods = async (form) => {
  const res = await service.post('goods', form)
  if (res.status === 200) {
    return res.data
  }
}


// 
export const getCateListAll = async () => {
  const res = await service.get('/categories')
  if (res.status === 200) {
    return res.data
  }
}

// 获取订单列表数据 1.10.1
export const getOrderList = async (queryInfo) => {
  const res = await service.get('/orders', {
    params: queryInfo
  })
  if(res.status === 200){
    return res.data
  }
}

// 查看物流信息ById
export const getProgressInfo = async id => {
  const res = await service.get(`/kuaidi/${id}`)
  if(res.status === 200){
    return res.data
  }
}

// 获取时间统计的折线图
export const getReport = async () => {
  const res = await service.get('/reports/type/1')
  if(res.status === 200){
    return res.data
  }
}



















