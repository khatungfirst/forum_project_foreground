<script setup>
import { ref, onMounted } from 'vue';
import { firstTagList, chooseTag } from '@/config/apis/tag';
import { useRouter } from 'vue-router';

const router = useRouter();
const tagList = ref([]);
const selectedTags = ref([]);
const isManualSelectionStarted = ref(false); // 跟踪用户是否已经开始手动选择

onMounted(async () => {
    const tagResponse = await firstTagList();
    if (tagResponse.code === 2000) {
        tagList.value = tagResponse.data.tags;
    } else {
        console.error('获取标签列表失败');
    }
});

const toggleTag = (tag) => {
    isManualSelectionStarted.value = true; // 用户开始手动选择
    const index = selectedTags.value.indexOf(tag);
    if (index > -1) {
        selectedTags.value.splice(index, 1);
    } else {
        selectedTags.value.push(tag);
    }
};

const randomSelect = () => {
    selectedTags.value = [];
    const allTags = [...tagList.value];
    let count = 5;
    while (count > 0 && allTags.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTags.length);
        const tag = allTags[randomIndex];
        selectedTags.value.push(tag);
        allTags.splice(randomIndex, 1);
        count--;
    }
    // 检查是否达到了5个标签
    if (selectedTags.value.length === 5) {
        isManualSelectionStarted.value = true; // 如果随机选择完成5个标签，标记为开始手动选择
    }
};

const confirmSelection = async () => {
    const selectedIds = selectedTags.value.map((tag) => tag.id);
    try {
        const response = await chooseTag({ tagIds: selectedIds });
        if (response.code === 2000) {
            console.log('标签提交成功');
            gotoHome();
        } else {
            console.error('提交失败:', response.message);
        }
    } catch (error) {
        console.error('提交标签出错:', error);
    }
};

const gotoHome = () => {
    router.push(`/home`);
};
</script>

<template>
    <div class="page-container">
        <div class="choose_tag">
            <div class="tag-container">
                <div
                    v-for="tag in tagList"
                    :key="tag.id"
                    class="tag"
                    :class="{ selected: selectedTags.includes(tag) }"
                    @click="toggleTag(tag)"
                >
                    {{ tag.name }}
                </div>
                <div class="action-buttons">
                    <span v-if="!isManualSelectionStarted" class="random-btn" @click="randomSelect">随机选择5个</span>
                    <span v-if="isManualSelectionStarted" class="confirm-btn" @click="confirmSelection">确定</span>
                    <span class="skip" @click="gotoHome">跳过</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 使用100%的视口高度 */
}

.choose_tag {
    width: 680px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.tag-container {
    margin-top: 25px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* 标签之间的间距 */
    padding: 20px;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.tag {
    cursor: pointer;
    padding: 10px;
    /* border: 1px solid #ccc;s */
    border-radius: 4px; /* 圆角边框 */
    transition: background-color 0.3s, color 0.3s; /* 平滑过渡效果 */
    font-size: 16px;
    background: rgb(242, 241, 241);
}

.tag:hover {
    background-color: #f0f0f0; /* 鼠标悬浮时的背景色 */
}

.selected {
    background-color: #c5e2d4;
    color: #19a059;
}

.random-btn,
.confirm-btn,
.skip {
    padding: 10px 20px;
    margin-top: 17px; /* 按钮与标签的间距 */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 24px;
    transition: background-color 0.3s;
}

.random-btn,
.confirm-btn {
    font-weight: 900;
    color: #19a059;
}

.skip {
    font-weight: 900;
    color: #cecfce;
}

.action-buttons {
    margin-top: 18px;
}
</style>
