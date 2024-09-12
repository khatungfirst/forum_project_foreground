<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
// import getImageUrl from '@/config/apis/publicArticle';

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('');
console.log(valueHtml.value);

//通过defineEmits编译器宏生成emit方法
const emit = defineEmits(['get-message']);

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        // valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
    }, 1500);
});

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} };

//上传图片
editorConfig.MENU_CONF['uploadImage'] = {
    // 上传图片的配置
    server: 'http://127.0.0.1:4523/m1/4891553-0-default/produce_image_url',
    maxFileSize: 1 * 1024 * 1024
    // base64LimitSize: 1024 * 1024 // 5kb
};

//上传视频
editorConfig.MENU_CONF['uploadVideo'] = {
    server: 'http://127.0.0.1:4523/m1/4891553-0-default/produce_image_url',
    maxFileSize: 100 * 1024 * 1024
};

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    emit('get-message', editor.getHtml());
    console.log('change:', editor.getHtml());
};
const handleDestroyed = (editor) => {
    console.log('destroyed', editor);
};
const handleFocus = (editor) => {
    console.log('focus', editor);
};
const handleBlur = (editor) => {
    console.log('blur', editor);
};
const customAlert = (info, type) => {
    alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = async (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event);

    // const { data } = await getImageUrl();
    // // 自定义插入内容
    // editor.insertText(`${data.src}`);

    // 返回值（注意，vue 事件的返回值，不能用 return）
    callback(true); // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
};

// const insertText = () => {
//     const editor = editorRef.value;
//     if (editor == null) return;
//     editor.insertText('hello world');
// };

// const printHtml = () => {
//     const editor = editorRef.value;
//     if (editor == null) return;
//     console.log(editor.getHtml());
// };

// const disable = () => {
//     const editor = editorRef.value;
//     if (editor == null) return;
//     editor.disable();
// };
</script>
<template>
    <div style="border: 1px solid #ccc">
        <Toolbar
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
            style="border-bottom: 1px solid #ccc"
        />
        <Editor
            :defaultConfig="editorConfig"
            :mode="mode"
            v-model="valueHtml"
            style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated"
            @onChange="handleChange"
            @onDestroyed="handleDestroyed"
            @onFocus="handleFocus"
            @onBlur="handleBlur"
            @customAlert="customAlert"
            @customPaste="customPaste"
        />
    </div>
    <div style="margin-top: 10px">
        <textarea v-model="valueHtml" readonly style="width: 100%; height: 200px; outline: none"></textarea>
    </div>
</template>
