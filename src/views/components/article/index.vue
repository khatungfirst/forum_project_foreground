<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@vicons/utils';
import { EyeOutlined } from '@vicons/antd';
import { LikeTwotone } from '@vicons/antd';

const prop = defineProps({
    item: {
        type: Object as () => {
            title: string;
            summary: string;
            nickname: string;
            published_at: string;
            views_count: number;
            likes_count: number;
            image_url: string;
            tags: Array<{
                ID: number;
            }>;
            id: string;
            status: boolean;
        },
        required: true,
        default: () => ({
            title: '',
            summary: '',
            nickname: '',
            published_at: '',
            views_count: 0,
            likes_count: 0,
            image_url: '',
            tags: [{ ID: 0 }],
            id: '',
            status: false
        })
    }
});

//路由对象
const route = useRouter();

//查看文章详情的方法
const checkDetail = () => {
    route.push(`/articledetail/${prop.item.id}`);
    console.log(prop.item.id);
};
</script>
<template>
    <ul class="content" @click="checkDetail">
        <li class="whole">
            <div class="left">
                <h3>{{ prop.item.title }}</h3>
                <slot name="type"></slot>
                <n-ellipsis :line-clamp="2" style="color: #868686; font-size: 14px; margin: 8px 0px">
                    {{ prop.item.summary }}

                    <template #tooltip>
                        <div style="text-align: center; width: 700px">
                            {{ prop.item.summary }}
                        </div>
                    </template>
                </n-ellipsis>
                <div class="detail-bottom">
                    <span>
                        {{ prop.item.nickname }}
                    </span>
                    <span class="time">{{ prop.item.published_at }}</span>
                    <span class="icon">
                        <Icon>
                            <EyeOutlined />
                        </Icon>
                        {{ prop.item.views_count }}
                    </span>
                    <span class="icon">
                        <Icon>
                            <LikeTwotone />
                        </Icon>
                        {{ prop.item.likes_count }}
                    </span>
                    <ul>
                        <li v-for="(tag, index) in prop.item.tags" :key="index" class="tag">
                            {{ tag.ID }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="right" v-if="prop.item.image_url !== ''">
                <slot class="edit" name="edit"></slot>
                <img :src="prop.item.image_url" alt="" />
            </div>
        </li>
    </ul>
</template>
<style scoped lang="scss">
.content {
    width: 100%;

    .other {
        display: grid;
        grid-template-columns: 5fr 1fr;
    }
}

.content:hover {
    cursor: pointer;
}
.whole {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid rgb(223, 217, 217);
    position: relative;
    z-index: 999;

    .left {
        flex: 1;

        h3 {
            float: left;
            margin-right: 10px;
        }
        .detail-bottom {
            span {
                margin: 0px 5px;
                font-size: 14px;
                color: #868686;
                padding: 0px 5px;
            }

            .time {
                padding: 0px 10px;
                border-left: 1px solid #d6d3d3;
                border-right: 1px solid #d6d3d3;
            }

            .icon {
                position: relative;
            }

            .icon :deep(svg) {
                height: 16px;
                position: absolute;
                /* top: 0px; */
            }
        }
        ul {
            display: inline-block;
            float: right;
            .tag {
                font-size: 12px;
                color: #7d8791;
                display: inline-block;
                margin-right: 10px;
                padding: 1px 10px;
                background-color: #f2f2f2;
            }
        }
    }

    .right {
        display: flex;
        flex-direction: row-reverse;
        position: relative;
        /* float: right; */
        margin-left: 8px;
        img {
            width: 165px;
            height: 130px;
        }
    }
}
</style>
