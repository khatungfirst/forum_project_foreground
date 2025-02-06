//目录预览
<script lang="ts" setup>
// import { ref, watch } from 'vue';

// // 定义 props 的类型
// interface Props {
//     content: string; // 假设传入的内容是 HTML 字符串
// }

// // 定义标题项的类型
// interface TableOfContentsItem {
//     title: string;
//     level: number;
//     id: string;
// }

// // 使用 defineProps 定义 props
// const props = defineProps<Props>();

// // 创建响应式变量
// const renderedMarkdown = ref<string>(props.content); // 直接使用 HTML 内容
// const tableOfContents = ref<TableOfContentsItem[]>([]);

// // 提取标题并生成目录
// const extractHeadings = () => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(props.content, 'text/html');
//     const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).map((heading) => {
//         const level = parseInt(heading.tagName.charAt(1), 10); // 获取标题级别
//         const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
//         tableOfContents.value.push({ title: heading.textContent || '', level, id });
//         heading.id = id; // 设置标题的 id
//         return heading.outerHTML; // 返回标题的 HTML
//     });

//     // 将提取的标题替换原始内容中的标题
//     renderedMarkdown.value = renderedMarkdown.value.replace(/<h[1-3]>.*?<\/h[1-3]>/g, () => {
//         return headings.shift() || ''; // 替换为提取的标题
//     });
// };

// // 监视内容变化
// watch(
//     () => props.content,
//     () => {
//         tableOfContents.value = []; // 清空目录
//         extractHeadings(); // 提取标题
//     },
//     { immediate: true }
// );
import { ref, onMounted, nextTick } from 'vue';
// markdown-文章内容
const Props = defineProps({
    content: String
});
// markdown-对象
const editor = ref(null);
// markdown-文章标题列表
const titleList = ref([]);
// markdown-生成标题
async function getTitle() {
    await nextTick();
    console.log(editor.value, '=======');
    if (editor.value) {
        // 使用js选择器，获取对应的h标签，组合成列表
        const anchors = editor.value.querySelectorAll('.v-md-editor-preview h1,h2,h3,h4,h5,h6');
        console.log(anchors, 'anchors');

        // 删除标题头尾的空格
        const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
        // 当文章h标签为空时，直接返回
        if (!titles.length) {
            titleList.value = [];
            return;
        }
        // 从h标签属性中，提取相关信息
        const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
        titleList.value = titles.map((el) => ({
            title: el.innerText, // 标题内容
            lineIndex: el.getAttribute('data-v-md-line'), // 标签line id
            indent: hTags.indexOf(el.tagName), // 标签层级
            height: el.offsetTop // 标签距离顶部距离
        }));
    }
}
onMounted(async () => {
    // 生成文章标题列表
    await getTitle();
});
watchEffect(async () => {
    // 当 Markdown 内容变化时重新生成标题列表
    await getTitle();
});
</script>
<template>
    <div class="toc">
        <div v-for="(item, index) in titleList" :key="index" :style="{ paddingLeft: (item.level - 1) * 15 + 'px' }">
            <a style="cursor: pointer">{{ item.title }}</a>
        </div>
        <v-md-preview :text="Props.content" ref="editor" />
    </div>

    <!-- <div v-html="renderedMarkdown"></div> -->
</template>

<style scoped lang="scss">
.toc {
    margin-bottom: 1em;

    ul {
        list-style-type: none;
        padding-left: 0;

        li {
            margin: 0.5em 0;

            a {
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
                color: #007bff; /* 悬停时的颜色 */
            }
        }
    }
}
</style>
