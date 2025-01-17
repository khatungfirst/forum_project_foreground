//目录预览
<script lang="ts" setup>
import { ref, watch, defineProps } from 'vue';

// 定义 props 的类型
interface Props {
    content: string; // 假设传入的内容是 HTML 字符串
}

// 定义标题项的类型
interface TableOfContentsItem {
    title: string;
    level: number;
    id: string;
}

// 使用 defineProps 定义 props
const props = defineProps<Props>();

// 创建响应式变量
const renderedMarkdown = ref<string>(props.content); // 直接使用 HTML 内容
const tableOfContents = ref<TableOfContentsItem[]>([]);

// 提取标题并生成目录
const extractHeadings = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(props.content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).map((heading) => {
        const level = parseInt(heading.tagName.charAt(1), 10); // 获取标题级别
        const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        tableOfContents.value.push({ title: heading.textContent || '', level, id });
        heading.id = id; // 设置标题的 id
        return heading.outerHTML; // 返回标题的 HTML
    });

    // 将提取的标题替换原始内容中的标题
    renderedMarkdown.value = renderedMarkdown.value.replace(/<h[1-3]>.*?<\/h[1-3]>/g, () => {
        return headings.shift() || ''; // 替换为提取的标题
    });
};

// 监视内容变化
watch(
    () => props.content,
    () => {
        tableOfContents.value = []; // 清空目录
        extractHeadings(); // 提取标题
    },
    { immediate: true }
);
</script>
<template>
    <div>
        <div class="toc">
            <ul>
                <li
                    v-for="(item, index) in tableOfContents"
                    :key="index"
                    :style="{ paddingLeft: (item.level - 1) * 15 + 'px' }"
                >
                    <a :href="'#' + item.id">{{ item.title }}</a>
                </li>
            </ul>
        </div>
        <!-- <div v-html="renderedMarkdown"></div> -->
    </div>
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
