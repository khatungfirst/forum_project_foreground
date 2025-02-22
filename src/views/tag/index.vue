<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { getTagList, Tag_follow } from '../../config/apis/tag';
import TagItem from '../components/tags/index.vue';
import { useRouter } from 'vue-router';
import PublishButton from '../components/PublishButton/index.vue';
import { useUserStore } from '@/config/store/userStore';
// 游客模式
import { useTouristPattern } from '@/config/store/touristPattern';
import author from '@/views/components/Author/index.vue';
const useTourist = useTouristPattern();

const tags = ref([]);

const router = useRouter();
const userStore = useUserStore();
const user_id = userStore.userInfo?.id || 0;

//----------------------------游客模式---------------------------------

//控制登录组件是否出现
const loginAppear = ref(false);

//触发登录的事件类型
const triggerType = ref('');

//告知子组件是否已经登录完毕
const isLogin = ref(false);

//登录后继续执行操作
// const performOperation = (type: string) => {
//     loginAppear.value = false;
//     switch (type) {
//         case '关注':
//             // 实现自动关注的方法
//             isLogin.value = true;
//             break;
//     }
// };
const performOperation = () => {
    loginAppear.value = false;
    switch (type) {
        case '关注':
            // 自动关注
            // if (authorToFollow.value !== null) {
            //     followAuthor({
            //         id: authorToFollow.value,
            //         is_followed: 1
            //     });
            // }
            follow_tag(id);
            isLogin.value = true;
            break;
    }
};

watch(
    () => useTourist.triggerType,
    (newVal) => {
        loginAppear.value = true;
        triggerType.value = newVal;
    }
);

onMounted(async () => {
    try {
        const response = await getTagList({ user_id: user_id });
        if (response.code === 2000) {
            tags.value = response.data.tag_list;
        } else {
            console.error('获取标签数据失败');
        }
    } catch (error) {
        console.error('请求标签数据出错:', error);
    }
});

const follow_tag = async (id) => {
    if (userStore.token === '') {
        // 存储当前作者 ID
        loginAppear.value = true;
        triggerType.value = '关注';
        console.log('关注了', loginAppear.value);
    } else {
        try {
            // 设置加载状态
            loadingState.value[id] = true;

            const response = await Tag_follow({ id: id });
            if (response.code === 2000) {
                // 更新本地标签数据
                const index = tags.value.findIndex((tag) => tag.id === id);
                if (index !== -1) {
                    tags.value[index].is_followed = true;
                } else {
                    tags.value.push({ id, is_followed: true });
                }
                // 重新获取整个标签列表
                await getTagListAgain();
            } else {
                console.error('关注标签失败:', response.message);
            }
        } catch (error) {
            console.error('Error following tag:', error);
        } finally {
            // 请求完成后，解除加载状态
            loadingState.value[id] = false;
        }
    }
};

const getTagListAgain = async () => {
    try {
        const response = await getTagList({ user_id: user_id });
        if (response.code === 2000) {
            tags.value = response.data.tag_list;
            // 重置加载状态
            loadingState.value = {};
        } else {
            console.error('重新获取标签数据失败');
        }
    } catch (error) {
        console.error('重新请求标签数据出错:', error);
    }
};
</script>

<template>
    <div class="content">
        <div class="overlay" v-if="loginAppear"></div>
        <author v-if="loginAppear" class="loginCom" :type="triggerType" @trigger-type="performOperation"></author>
        <div class="tag-list-container">
            <TagItem
                v-for="tag in tags"
                :key="tag.id"
                :tag="tag"
                :is-following="tag.status === 1"
                @follow="follow_tag(tag.id)"
            />
        </div>
        <div>
            <PublishButton></PublishButton>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixin.scss' as *;
.content {
    display: flex;
    justify-content: center;
    margin-top: 65px;
}

@include overlay;
.loginCom {
    z-index: 1000;
    position: fixed;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
    background-color: #fff;
}

.tag-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 100px;
}

.tag-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px 90px;
    gap: 20px; /* 控制标签之间的间距 */
    width: 87%;
}

.tag-item-single {
    width: calc(33% - 20px); /* 控制每个标签的宽度 */
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #ffffff;
}
</style>
