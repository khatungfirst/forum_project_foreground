<script setup>
import { ref, defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
    authors: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['follow']);

const followedStates = ref(props.authors.map((author) => author.is_followed));

const toggleFollow = (author) => {
    if (author.is_followed === 2) {
        alert('您无法关注自己');
        return;
    }
    const index = props.authors.indexOf(author);
    followedStates.value[index] = !followedStates.value[index];
    emit('follow', author.id);
    console.log(`Toggle follow for ${author.nickname}`);
};

const processedAuthors = computed(() => {
    return props.authors.map((author, index) => {
        const truncatedCareer =
            author.career_direction.length > 16
                ? author.career_direction.slice(0, 16) + '...'
                : author.career_direction;
        return {
            ...author,
            career_direction: truncatedCareer,
            is_followed: followedStates.value[index]
        };
    });
});
</script>

<template>
    <div class="author-rank-item">
        <div class="author-rank-item_container">
            <div class="author-rank-item_header">
                <span>作家榜单</span>
            </div>
            <hr class="author-rank-divider" />
            <div class="author-rank-item_content">
                <div v-for="author in processedAuthors" :key="author.id" class="author-rank-item_single">
                    <img
                        v-if="author.avatar_path"
                        :src="author.avatar_path"
                        alt="Author avatar"
                        class="author-rank_avatar"
                    />
                    <div class="author-rank-item_info">
                        <span class="author-rank-item_title">{{ author.nickname }}</span>
                        <p class="author-rank-item_career">{{ author.career_direction }}</p>
                    </div>
                    <div class="author-rank-item_follow">
                        <button class="author-rank-item_button" @click="toggleFollow(author)">
                            <!-- 根据 author.is_followed 的值显示不同的文本 -->
                            {{ author.is_followed === 0 || author.is_followed === 2 ? '+关注' : '已关注√' }}
                        </button>
                    </div>
                </div>
            </div>
            <hr class="author-rank-divider" />
            <div class="author-rank-more">
                <span>查看更多></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.author-rank-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 290px;
}

.author-rank-item_single {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 3px 0;
}

.author-rank-item_container {
    width: 100%;
}

.author-rank-item_header {
    font-size: 17px;
    margin-bottom: 10px;
    text-align: left;
}

.author-rank-item_content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.author-rank_avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    margin-right: 15px;
}

.author-rank-item_info {
    flex-grow: 1;
}

.author-rank-item_title {
    margin: 0;
    font-size: 15px;
}

.author-rank-item_career {
    margin: 1px 0;
    font-size: 14px;
    color: #7d7b7b;
}

.author-rank-item_follow {
    display: flex;
    align-items: center;
    margin-left: auto;
}

.author-rank-item_button {
    padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;
    background-color: #f0f0f0;
    border: none;
    border-radius: 5px;
    outline: none;
    color: #19a059;
}

.author-rank-item_button:hover {
    background-color: #e0e0e0;
}

.author-rank-divider {
    width: 100%;
    border: 0;
    height: 1px;
    background-color: #e7dfdf;
    margin: 10px 0;
}

.author-rank-more {
    text-align: center;
    color: #a9a5a5;
}
</style>
