<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    authors: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['follow']);

const followedStates = ref(props.authors.map((author) => author.is_followed));

watch(
    () => props.authors,
    (newAuthors) => {
        followedStates.value = newAuthors.map((author) => author.is_followed);
    },
    { deep: true }
);

const toggleFollow = async (author) => {
    if (author.is_followed === 2) {
        alert('您无法关注自己');
        return;
    }
    const index = props.authors.indexOf(author);
    const newFollowState = author.is_followed === 0 ? 1 : 0; // 切换关注状态
    followedStates.value[index] = newFollowState;
    emit('follow', { id: author.id, is_followed: newFollowState });
    console.log(`Toggle follow for ${author.nickname}`);
    console.log('author.is_followed', author.is_followed);
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

const enterMemberCenter = (id) => {
    router.push({ path: `/member/${id}` });
};

const refreshAuthors = () => {
    emit('refresh');
};
</script>

<template>
    <div class="author-rank-item">
        <div class="author-rank-item_container">
            <div class="author-rank-item_header">
                <div class="author-rank-item_left">
                    <i class="iconfont icon-zuozhe1"></i>
                    <span>作家榜单</span>
                </div>
                <i class="iconfont icon-gengxin author-rank-item_right" @click="refreshAuthors"></i>
            </div>
            <hr class="author-rank-divider" />
            <div class="author-rank-item_content">
                <div v-for="author in processedAuthors" :key="author.id" class="author-rank-item_single">
                    <img
                        v-if="author.avatar_path"
                        :src="author.avatar_path"
                        alt="Author avatar"
                        class="author-rank_avatar"
                        @click="enterMemberCenter(author.id)"
                    />
                    <div class="author-rank-item_info">
                        <span class="author-rank-item_title" @click="enterMemberCenter(author.id)">
                            {{ author.nickname }}
                        </span>
                        <p class="author-rank-item_career">{{ author.career_direction }}</p>
                    </div>
                    <div class="author-rank-item_follow">
                        <button class="author-rank-item_button" @click="toggleFollow(author)">
                            <!-- 根据 author.is_followed 的值显示不同的文本 -->
                            {{ author.is_followed === 1 ? '已关注√' : '+关注' }}
                        </button>
                    </div>
                </div>
            </div>
            <!-- <hr class="author-rank-divider" /> -->
            <div class="author-rank-more">
                <!-- <span>查看更多></span> -->
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
    /* border: 1px solid #ccc; */
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
    display: flex;
    align-items: center; /* 垂直居中 */
    width: 100%; /* 确保占满容器宽度 */
    justify-content: space-between;
    font-size: 17px;
    margin-bottom: 10px;
    text-align: left;
}
.author-rank-item_left {
    display: flex;
    align-items: center;
}

.author-rank-item_right {
    display: flex;
    align-items: center;
}
.author-rank-item_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
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
    /* background-color: #f0f0f0; */
    background: none; /* 去掉背景 */
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

.iconfont {
    font-size: 24px;
    color: #19a059;
    margin-right: 10px;
}

.iconfont .icon-zuozhe1 {
    font-size: 26px;
    color: #19a059;
}

.icon-gengxin {
    font-size: 22px;
    color: #a9a5a5;
    float: right;
    margin-right: 20px;
    cursor: pointer;
}
</style>
