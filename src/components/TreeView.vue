<!-- Demo6CustomTreeView.vue -->
<script>
import {
  Tree, // Base tree
  Fold,
  Check,
  Draggable, // plugins
  //foldAll,
  //unfoldAll,
  //cloneTreeData,
  walkTreeData,
  //getPureTreeData, // utils
} from 'he-tree-vue';

import { computed } from 'vue';

export default {
  extends: Tree,

  mixins: [Fold, Check, Draggable],

  props: {
    triggerClass: { default: 'drag-trigger' },
    // prevent drag by default.
    draggable: { type: [Boolean, Function], default: false },
    droppable: { type: [Boolean, Function], default: false },
  },

  setup(props, context) {
    let total = computed(() => {
      let i = 0;
      walkTreeData(props.rootNode, () => {
        i++;
      });
      return i;
    });

    const blockFooter = () => {
      return (
        <div class='footer'>
          <i>Комментариев:</i> {total}
        </div>
      );
    };

    const reply = () => {
      context.emit('reply');
    };

    const showHidden = () => {
      walkTreeData(props.rootNode, (node) => {
        node['$hidden'] = false;
      });
    };

    const toggleChildNodes = (node, toggleShow) => {
      if (!node.children) return
      for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        child['$hidden'] = toggleShow;
      }
      node['$wrapped'] = toggleShow;
    };

    const search = (e) => {
      const value = e.target.value || '';
      walkTreeData(props.rootNode, (node) => {
        if (!node.text) return
        node['$hidden'] = !node.text.includes(value);
      });
    };

    const requestRemoveNodes = (nodeToRemoveChildrens) => {
      walkTreeData(nodeToRemoveChildrens, (node) => {
        context.emit('removeNode', node);
      });
    };

    const nodeEdit = (node) => {
      context.emit('nodeEdit', node);
    };
    const nodeReply = (node) => {
      context.emit('nodeReply', node);
    };
    const nodeDelete = (node) => {
      requestRemoveNodes(node);
    };
    
    const overrideSlotDefault = ({ node, /* index, path, tree */ }, original) => {
      // const classes = isActive && 'node-active';
      switch (node.type) {
        case 'empty': return (
          <div className={`node-wrapper ${node.isChildren && 'node-children'}`}>
            <div className='node-content'>
              <div>{original()}</div>
              <button class='btn-group__item' onClick={reply}>
                Ответить
              </button>
            </div>
          </div>
        )
        default: return (
          <div className={`node-wrapper ${node.isChildren && 'node-children'}`}>
            <div className='node-content'>
              <div>{original()}</div>
              { node.children ?
                  !node.$wrapped ? 
                  <button class='mls btn' onClick={() => toggleChildNodes(node, true)}>
                    Свернуть
                  </button> :
                  <button class='mls btn' onClick={() => toggleChildNodes(node, false)}>
                    Развернуть
                  </button>
                : ''
              }
            </div>
            <div className='node-footer'>
              <button onClick={() => nodeEdit(node)}>Редактировать</button>
              <button onClick={() => nodeReply(node)}>Ответить</button>
              <button onClick={() => nodeDelete(node)}>Удалить</button>
            </div>
          </div>
        );
      } 
    };

    const blockHeader = () => {
      return (
        <div class='header'>
          <div class='btn-group'>
            <button class='btn-group__item' onClick={reply}>
              Ответить
            </button>
            <button classs='btn-group__item' onClick={showHidden} class='mls'>
              Развернуть ветку
            </button>
          </div>
          <input
            class='search'
            onKeydown={(e) => e.key === 'Enter' && search(e)}
            placeholder='Поиск'
          />
        </div>
      );
    };

    return {
      overrideSlotDefault,
      blockHeader,
      blockFooter,
      reply,
      showHidden,
      toggleChildNodes,
      search,
    };
  },
};
</script>

<style>
.search {
  margin: 5px;
  padding: 10px 5px;
  width: calc(100% - 20px);
  border: none;
  border-radius: 5px;
}

.tree-children {
  margin-left: 15px;
}

.btn-group {
  margin: 5px;
  display: flex;
  justify-content: flex-start;
}

.btn-group button {
  margin-right: 5px;
}

.btn-group button:nth-last-child(1) {
  margin: 0;
}

.node-wrapper {
    width: 100%;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: left;
    line-height: 18px;
    font-size: 14px;
    border: 1px solid #ccc;
}

.node-wrapper:hover {
  box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.63);
}

.node-content {
  padding: 15px;
}

.node-footer {
  padding: 15px;
  padding-top: 0;
}

.btn {
  margin: 3px;
}

.he-tree .tree-node{
  margin-bottom: 5px;
  padding: 5px;
}

.he-tree--hidden{
  display: none;
}

.he-tree--rtl{
  direction: rtl;
}

.he-tree .tree-placeholder-node{
  background: #ddf2f9;
  border: 1px dashed #00d9ff;
  height: 20px;
}

.he-tree .dragging .tree-node-back:hover{
  background-color: inherit;
}

.tree-node-back {
  padding: 0;
  width: 100%;
}
.tree-node-back .tree-node {
  border: none;
}
.my-tree-view1 .mls {
  margin-left: 5px;
}
.my-tree-view1 .mrs {
  margin-right: 5px;
}
.my-tree-view1 .tree-node {
  padding: 0;
  border: none;
}
.my-tree-view1 .node-content {
  display: flex;
}
.my-tree-view1 .node-content .fold-btn {
  display: flex;
  justify-content: center;
  width: 22px;
  border-radius: 100%;
  border: none;
  background: #fcf1a8;
}
.my-tree-view1 .tree-node-back:hover {
  background: #f5f5f5;
}
.my-tree-view1 .header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
  margin-bottom: 10px;
}
.he-tree .footer {
  margin: 10px;
  margin-top: 10px;
  text-align: left;
}
.he-tree .footer i {
  color: #fff;
  font-weight: bold;
}
</style>
