import { Editor } from "grapesjs";
const LoginBoxed = import('../../../pages/Auth/LoginBoxed');

export function customSimpleBlock(editor: Editor) {
  const domc = editor.DomComponents;
  domc.addType('apiTable', {
    model: {
      defaults: {
        tagName: 'div',
        content: '', 
      },
    },
  });

  editor.BlockManager.add('apiTable', {
    label: 'API Table',
    category: 'NEXTGEN COMPONENT',
    content: {
      type: 'apiTable',
      content: 'Loading data...', 
    },
  });

  editor.Commands.add('fetchApiData', {
    run: (editor, sender, opts = {}) => {
      setTimeout(() => {
        const tableModel = editor.getComponents().get(".apiTable");
        console.log(tableModel);
        if(tableModel != undefined){
          console.log(tableModel.find('.apiTable'),"componss",tableModel)
          let model =  tableModel.find('.apiTable')[0];
          if(model){
            tableModel.set('content', "okssssssssssssssss");
          }
        }
      },3000);
    },
  });
 

  editor.on('load', () => {
    editor.runCommand('fetchApiData');
  });

  // editor.Blocks.add('apiTable', {
  //     label: 'Simple block',
  //     content: {
  //       type: 'apiTable',
  //       content: `<div class="my-block">users</div>`,
  //     },

  // });

}