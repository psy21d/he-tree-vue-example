import { createStore } from 'vuex'
import { commentaries } from '@/mock/commentaries.js'
var ls = require('local-storage');

//declare type AppPromisableConfig = {
//   show: boolean
//   promise?: {
//     resolve: () => void
//     reject: () => void
//   }
// }

window.ls = ls

let loadCommentaries = (arr) => {
  if (ls('localized') === 'true') {
    try {
      arr = []
      arr = JSON.parse(ls('commentaries'))
    } catch (e) {
      console.log(e)
      console.log('cannot load commentaries')
    }
  }
  let hash = hashFromArray(arr)
  arrayFromHash(hash)
  return hash
}

let hashFromArray = (arr) => {
  let hash = {}
  arr.forEach(item => hash[item.id] = item)
  return hash
}

let arrayFromHash = (hash) => {
  let arr = []
  Object.keys(hash).forEach(key => {
    arr.push(hash[key])
  })
  try {
    ls('commentaries', JSON.stringify(arr))
    ls('localized', 'true')
  } catch(e) {
    console.log(e)
    console.log('cannot save commentaries')
  }
  return arr
}

export const store = createStore({
  state () {
    return {
      commentaries: arrayFromHash(loadCommentaries(commentaries)),
      hash: loadCommentaries(commentaries),
      dialogVisible: false,
      dialogText: '',
      dialogConfirmed: false,
      parentId: null,
      nodeId: null,
      dialogPromise: {
        resolve: () => {},
        reject: () => {}
      }
    }
  },
  getters: {
    commentaries: state => {
      return state.commentaries;
    },
    hash: state => {
      return state.hash;
    },
    dialogVisible: state => {
      return state.dialogVisible;
    },
    dialogText: state => {
      return state.dialogText;
    },
    dialogConfirmed: state => {
      return state.dialogConfirmed;
    },
    parentId: state => {
      return state.parentId;
    },
    nodeId: state => {
      return state.nodeId;
    },
    dialogPromise: state => {
      return state.dialogPromise;
    }
  },
  mutations: {
    set(state, { key, value }) {
      state[key] = value
    },
    updateCommentariesFromHash(state) {
      state.commentaries = arrayFromHash(state.hash)
    },
    addCommentary (state, commentary) {
      state.hash[commentary.id] = commentary
      this.commit('updateCommentariesFromHash')
    },
    removeCommentary (state, commentary) {
      state.hash[commentary.id] = undefined
      delete state.hash[commentary.id]
      this.commit('updateCommentariesFromHash')
    },
    editCommentary (state, commentary) {
      state.hash[commentary] = commentary
      this.commit('updateCommentariesFromHash')
    },
    setDialog(state, dialogPromise) {
      state.dialogPromise = dialogPromise;
      state.dialogConfirmed = false;
      state.dialogVisible = true;
    },
    resolveDialog(state) {
      state.dialogPromise.resolve();
      state.dialogConfirmed = true;
      state.dialogVisible = false;
    },
    rejectDialog(state) {
      state.dialogPromise.reject();
      state.dialogConfirmed = false;
      state.dialogVisible = false;
    },
  },
  actions: {
    addCommentary (state, commentary) {
      state.commit('addCommentary', commentary)
    },
    removeCommentary (state, commentary) {
      state.commit('removeCommentary', commentary)
    },
  }
})