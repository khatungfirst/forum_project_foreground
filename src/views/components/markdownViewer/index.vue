//目录预览
<script lang="ts" setup>
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
    console.log(editor.value, 'editor');

    // 使用js选择器，获取对应的h标签，组合成列表
    const anchors = editor.value.querySelectorAll('h1,h2,h3,h4,h5,h6');
    console.log(anchors, 'anchors');
    anchors.forEach((heading, index) => {
        heading.setAttribute('data-v-md-line', `line-${index}`);
    });

    // 删除标题头尾的空格
    const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
    // 当文章h标签为空时，直接返回
    if (!titles.length) {
        titleList.value = [];
        return;
    }
    // 从h标签属性中，提取相关信息
    const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
    console.log(titles, 'titles');

    titleList.value = titles.map((el) => ({
        title: el.innerText, // 标题内容
        lineIndex: el.getAttribute('data-v-md-line'), // 标签line id
        indent: hTags.indexOf(el.tagName), // 标签层级
        height: el.offsetTop // 标签距离顶部距离
    }));
    console.log(titleList, 'titleList');
}
// markdown-当前高亮的标题index
const heightTitle = ref(0);
// markdown-标题跳转
const rollTo = (anchor, index) => {
    // 获取要跳转的标签的lineIndex
    const { lineIndex } = anchor;

    // 查找lineIndex对应的元素对象
    const heading = editor.value.querySelector(`.v-md-editor-preview [data-v-md-line="${lineIndex}"]`);
    // 页面跳转
    if (heading) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // 修改当前高亮的标题
    heightTitle.value = index;
};

// markdown-页面滚动。
const scroll = () => {
    // 监听屏幕滚动时防抖（在规定的时间内触发的事件，只执行最后一次，降低性能开销）
    let timeOut = null; // 初始化空定时器
    return () => {
        clearTimeout(timeOut); // 频繁操作，一直清空先前的定时器
        timeOut = setTimeout(() => {
            // 只执行最后一次事件
            const scrollTop = window.pageYOffset;
            // console.log(window.pageYOffset)
            const absList = []; // 各个h标签与当前距离绝对值
            titleList.value.forEach((item) => {
                absList.push(Math.abs(item.height - scrollTop));
            });
            // 屏幕滚动距离与标题高度最近的index高亮
            heightTitle.value = absList.indexOf(Math.min.apply(null, absList));
        }, 500);
    };
};
watchEffect(async () => {
    // 当 Markdown 内容变化时重新生成标题列表
    await getTitle();
});
onMounted(async () => {
    // 生成文章标题列表
    await getTitle();
    // 监听页面滚动事件
    window.addEventListener('scroll', scroll());
});
onBeforeUnmount(() => {
    // 离开该页面时移除这个监听的事件
    window.removeEventListener('scroll', scroll());
});
</script>
<template>
    <div class="toc">
        <div
            v-for="(item, index) in titleList"
            :key="index"
            :style="{ paddingLeft: item.indent * 15 + 'px' }"
            @click.stop="rollTo(item, index)"
            :class="index === heightTitle ? 'title-active' : ''"
        >
            <a style="cursor: pointer">{{ item.title }}</a>
        </div>
        <div ref="editor">
            <v-md-preview :text="Props.content" />
        </div>
    </div>

    <!-- <div v-html="renderedMarkdown"></div> -->
</template>

<style scoped lang="scss">
.toc {
    margin-bottom: 1em;

    // ul {
    //     list-style-type: none;
    //     padding-left: 0;

    //     li {
    //         margin: 0.5em 0;

    //         a {
    //             text-decoration: none;
    //         }

    //         a:hover {
    //             text-decoration: underline;
    //             color: #007bff; /* 悬停时的颜色 */
    //         }
    //     }
    // }
    .title-active {
        color: #4ad77c;
    }
}
</style>
