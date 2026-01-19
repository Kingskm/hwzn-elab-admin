const getDefaultState = () => {
  return {
    itemOpInfo:null,
  }
}

const state = getDefaultState()

const mutations = {
  //分项操作信息
  setItemOpInfo: (state, itemOpInfo) => {
    state.itemOpInfo = itemOpInfo
    localStorage.setItem('itemOpInfo',JSON.stringify(itemOpInfo))
  },
  removeItemOpInfo(state) {
    state.itemOpInfo = null
    localStorage.removeItem('itemOpInfo')
  },
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

